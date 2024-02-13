import { Component, OnInit } from '@angular/core';
import { QuizService } from '../service/quiz.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'
@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  showThemes = true;

  constructor(public quizService: QuizService, private http: HttpClient, private _router: Router) { }

  ngOnInit(): void {
    // Affichage des themes de quiz en fois connecter
    this.getThemes();
  }
  // fonction qui recupère les themes existant dans le serveur mongoDB
  getThemes() {
    this.http.get(`http://pedago.univ-avignon.fr:3125/getThemes`).subscribe((result: any) => {
      this.quizService.themes = result;
    }, (error: any) => {
      console.log(error);
    })
  }

  // fonction sert à selectionner un theme pour jouer et aussi selectionner un niveau de jeu
  selectTheme(theme: String, level: any) {
    // initialisation des variables (les correctes reponses par exemple)
    this.showThemes = false;
    this.quizService.seconds = 0;
    this.quizService.questionProgress = 0;
    this.quizService.correctAnswerCount = 0;
    // reintialiser le timer à zero
    clearInterval(this.quizService.timer);
    // lancer le timer
    this.startTimer();
    // recuperer le quiz à partir de theme choisie
    this.quizService.getQuizByTheme(theme, level).subscribe((response: any) => {
      this.quizService.quiz = response;
      // si le niveu de jeux n'est pas difficile
      if (level != 3) {

        for (var i = 0; i < 5; i++) {

          // récuperer l'indice de la réponse correct
          var index = this.quizService.quiz[i].propositions.indexOf(this.quizService.quiz[i].réponse);
          // initialisation d'un compteur
          var count = 0;
          var deleted = 0;

          // verifie si l'index (la bonne réponse) existe bien dans le tableau des propositions
          if (index > -1) {

            // si le niveau est facile
            if (level == 1) {
              // boucler le tableau du quizz  
              while (count < this.quizService.quiz[i].propositions.length) {

                /* 
                si la proposition n'est pas la bonne réponse 
                et le nombre de propositions supprimées inférieur à 2 
                (max à supprimer est 2 pour niveau facile)
                */
                if (count != index && deleted < 2) {

                  // supprimer la proposition (splice() redimentionne le tableau à chaque suppression)
                  this.quizService.quiz[i].propositions.splice(count, 1);

                  //retrouver le nouvel emplacement de la bonne réponse dans le tableau
                  index = this.quizService.quiz[i].propositions.indexOf(this.quizService.quiz[i].réponse);

                  //incrémenter le nombre de proposition supprimées
                  deleted++;

                  //réinitialiser le compteur à -1 vu qu'il va s'incrémenter et revenir au 0
                  count = -1;
                }
                // incrémentation du compteur 
                count++;
              }

              // si le niveau est intermédiaire
            } else if (level == 2) {
              // boucler le tableau du quizz  
              while (count < this.quizService.quiz[i].propositions.length) {

                /* 
                si la proposition n'est pas la bonne réponse 
                et le nombre de propositions supprimées inférieur à 1 
                (max à supprimer est 1 pour niveau intermediaire)
                */
                if (count != index && deleted < 1) {

                  // supprimer la proposition splice() redimentionne le tableau à chaque suppression
                  this.quizService.quiz[i].propositions.splice(count, 1);

                  //retrouver le nouvel emplacement de la bonne réponse dans le tableau
                  index = this.quizService.quiz[i].propositions.indexOf(this.quizService.quiz[i].réponse);

                  //incrémenter le nombre de proposition supprimées
                  deleted++;

                  //réinitialiser le compteur à -1 vu qu'il va s'incrémenter et revenir au 0
                  count = -1;
                }
                // incrémentation du compteur
                count++;
              }

            }
          }
        }
      }
    }, (error: any) => {
      console.log('Error : ', error);
    })

  }

  /*
  setIntervalle utilisé pour répéter une fonction spécifiée à chaque intervalle de temps donné.
  Cette méthode continue l'appel de la fonction jusqu'à ce que la fenêtre soit fermée ou que la 
  méthode clearInterval() soit appelée
  */
  startTimer() {
    this.quizService.timer = setInterval(() => {
      this.quizService.seconds++;
    }, 1000);
  }

  // Choisir les réponses 
  selectAnswer(questionId: any, choix: any) {

    // si le joueur à choisi la bonne réponse
    if (this.quizService.quiz[this.quizService.questionProgress].réponse ==
      this.quizService.quiz[this.quizService.questionProgress].propositions[choix]) {

      // stockage des id de questions correctement répendu
      this.quizService.correct[this.quizService.correctAnswerCount] = this.quizService.quiz[this.quizService.questionProgress].id;
      // incrémentation de nombre des réponses correctes
      this.quizService.correctAnswerCount++;

    }

    // stockage du choix dans un tableau 
    this.quizService.choix[this.quizService.questionProgress] = choix;

    // Pour passer à la question suivante 
    this.quizService.questionProgress++;

    // verifier si les questions ont términé (dans ce cas nous avons 5 questions au total)
    if (this.quizService.questionProgress == 5) {
      clearInterval(this.quizService.timer);
      this._router.navigate(['/resultat']);
    }
  }

  selectLevel(level: number) {
    this.quizService.level = level;
  }
  choixTheme(theme: number) {
    this.quizService.theme = theme;
  }


}
