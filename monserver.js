// définition des modules à charger


const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const pgClient = require('pg');
const crypto = require('crypto');
const cors = require('cors');
// appel
const app = express();
// relier entre angular et node
app.use(cors());
const port = 3125;
//  Listn to the port 3125
var server = app.listen(port, function() {
    console.log('Listn to the port 3125');
});
// Sert à lire les données au format HTML
app.use(bodyParser.urlencoded({
    extended: true
}));
// parser les données de format json
app.use(express.json());

__dirname = '/nfs/data01/data/uapv21/uapv2100208/public_html/';
// lire le fichier géneré par la commande ng build dans le dossier dist (index.html)
app.use(express.static(__dirname + '/CeriGame/dist/CeriGame/'));
// Récupération de fichier index.html par GET dans l'URL

// creer une session dans mongoDB
app.use(session({
    secret: 'abderrahim',
    saveUninitialized: false,
    resave: false,
    // mongo db   apres db.MySession3125.find()
    store: new MongoDBStore({
        uri: "mongodb://127.0.0.1:27017/db",
        collection: 'MySession' + port,
        touchAfter: 24 * 3600
    }),
    cookie: {
        maxAge: 24 * 3600 * 1000
    }
}));
// Récupération des information envoyées par le formulaire et les afficher
app.post('/login', function(request, response) {

    var username = request.body.username;
    var password = request.body.password;
    // crypter le mot de passe et la modifier sous forme hash
    const hashPass = crypto.createHash('sha1').update(password).digest('hex');


    if (!username || !password) {
        return response.status(400).send('No name or password specified');
    }
    // demarer une connexion avec le serveur pg
    var pool = new pgClient.Pool({
        user: 'uapv2100208',
        host: '127.0.0.1',
        database: 'etd',
        password: 'IMQ0xT',
        port: '5432'
    });

    pool.connect(function(err, client, done) {
        if (err) {
            console.log('Error connecting to pg server' + err.stack);
        } else {
            console.log('Connection established with pg db server')
                // Exécution de la requête SQL et traitement du résultat
            sql = "select * from fredouil.users where identifiant ='" + username + "' and motpasse ='" + hashPass + "';";
        }
        client.query(sql, (err, result) => {
                if (err) {
                    console.log('Erreur d’exécution de la requete' + err.stack);
                } else if (result.rows[0] == null) {
                    console.log('User not found');
                    var responseObject = {
                        'id': -1
                    };
                    response.status(200).send(responseObject);
                } else {
                    // Mise à jour du status de connexion pour l'utilisateur connecté à 1
                    client.query("update fredouil.users set status_connexion = 1 where id='" + result.rows[0].id + "';", () => {
                        // creer une session avec les données recupere dans la base de donnees
                        request.session.isConnected = true;
                        request.session.id = result.rows[0].id;
                        request.session.identifiant = result.rows[0].identifiant;
                        //request.session.nom = result.rows[0].nom;
                        request.session.prenom = result.rows[0].prenom;
                        request.session.date_de_naissance = result.rows[0].date_naissance;
                        request.session.avatar = result.rows[0].avatar;
                        request.session.statut = 1;
                        request.session.humeur = result.rows[0].humeur;

                        var last_connection = new Date();
                        var date = last_connection.getDate() + "/" + (last_connection.getMonth() + 1) + "/" + last_connection.getFullYear();
                        var heure = last_connection.getHours() + ":" + last_connection.getMinutes();

                        const responseObject = {

                            'id': result.rows[0].id,
                            'identifiant': result.rows[0].identifiant,
                            'nom': result.rows[0].nom,
                            'prenom': result.rows[0].prenom,
                            'date de naissance': result.rows[0].date_naissance,
                            'avatar': result.rows[0].avatar,
                            'humeur': result.rows[0].humeur,
                            'status_de_connexion': true,
                            'date': last_connection.getFullYear(),
                            'date': date,
                            'heure': heure
                        };
                        // Envoie de cet objet comme response au client
                        response.status(200).send(responseObject);
                    })
                }

            })
            //Ferméture de la connexion
        client.release();
    })
});

app.post('/logout' ,(req,res)=>{

  //const svalue = req.session.user_id;

  // Récuperation depuis la requête l'id de l'utilisateur qui veut se déconnecter
  const svalue = req.body.id;

    if(svalue !== null){

        //configuration de connexion a la BD postgress
         var pool = new pgClient.Pool({
        user: 'uapv2100208',
        host: '127.0.0.1',
        database: 'etd',
        password: 'IMQ0xT',
        port: '5432'
    }); 


          //connexion
        pool.connect(function(err, client, done) {

            if(err) {
                console.log('Error connecting to pg server' + err.stack);
            }  
          
            // Mise à jour du status de connexion pour l'utilisateur déconnecté à 0
            client.query('update fredouil.users set statut_connexion = 0 where id=$1',[svalue],()=>{

                if(err){
                  console.log('ereur d\'execution de la deconnexion de l\'utilisateur ');
                }else{
                // Envoie de true si l'utilisateur est déconnecté avec succès
                  console.log('utilisateur deconnecté avec succes');
                res.status(200).send(true);
                }
            });

            client.release();
        });

    } 

    req.session.destroy();
  
});
