import { Component, OnInit } from '@angular/core';
import { Authentification } from '../service/authentification.service'
import { BandeauServiceService } from '../service/bandeau-service.service';
import { QuizService } from '../service/quiz.service';
import { Router } from '@angular/router'


@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  // declaration des variables utiles pour le remplissage de notre profil
  id: any = '';
  identifiant: string = '';
  nom: any = '';
  prenom: any = '';
  annee_naissance: string = '';
  humeur: string = '';
  avatar: string = '';
  avatarupdate: string = '';
  historique: any;
  tab: any;

  constructor(private _auth: Authentification, private bandeauService: BandeauServiceService, private _router: Router, public quizService: QuizService) { }

  ngOnInit(): void {
    // En fois l'utilisateur se connecter il remplisse son profil à partir de localStroage
    this.id = JSON.parse(localStorage.getItem('user') || '{}').id;
    this.identifiant = JSON.parse(localStorage.getItem('user') || '{}').identifiant;
    this.nom = JSON.parse(localStorage.getItem('user') || '{}').nom;
    this.prenom = JSON.parse(localStorage.getItem('user') || '{}').prenom;
    this.humeur = JSON.parse(localStorage.getItem('user') || '{}').humeur;
    this.avatar = JSON.parse(localStorage.getItem('user') || '{}').avatar;
    this.annee_naissance = JSON.parse(localStorage.getItem('user') || '{}')["date de naissance"];
    // En fois l'utilisateur se connecter remplissage de l'historique 
    this.displayHistorique(this.id);
  }
  // Update l'avatar de profil et on peut aussi faire update l'humeur de la meme facons 
  update_profil() {
    this._auth.updateProfil(JSON.parse(localStorage.getItem('user') || '{}').id, this.avatarupdate).subscribe(
      (response: any) => {
        if (response === true) {
          this.bandeauService.style.next("success");
          this.bandeauService.messageIn.next("Le profil a été mise à jour !");
        }

      }, (error: any) => {
        console.log('Error is : ', error);
      })

  }
  // fonction sert à recuperer l'historique à partir de serveur PG
  displayHistorique(user_id: any) {

    this.quizService.getHistoriqueById(user_id).subscribe((response: any) => {

      if (response != false) {
        this.historique = response;

        // boucler les scores de joueur à partir de l'historique
        for (let result of response) {
          this.tab = result.score;
        }
        // recuperer le score max de joueur
        localStorage.setItem('scoreMax', JSON.stringify(Math.max(this.tab)));
      }

    }, (error) => {
      console.log('Error is : ', error);
    })

  }

}
