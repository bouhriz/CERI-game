import { Component, OnInit } from '@angular/core';
import { QuizService } from '../service/quiz.service';
import { HttpClient } from '@angular/common/http';
import { BandeauServiceService } from '../service/bandeau-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resultat',
  templateUrl: './resultat.component.html',
  styleUrls: ['./resultat.component.css']
})
export class ResultatComponent implements OnInit {

  timeElapsed: any;
  correctAnswers: any;
  date_jeu: any;

  // id de l'utilisateur connecté
  user_id: any;
  score: number;
  nbQuestions: any = 5;
  level: number;

  constructor(public quizService: QuizService, private _router: Router, private http: HttpClient, private bandeauService: BandeauServiceService) {

  }

  ngOnInit(): void {
    this.timeElapsed = this.quizService.seconds;
    this.correctAnswers = this.quizService.correctAnswerCount;
    this.level = this.quizService.level;

    // récupérer la date actuelle de la fin de quiz 
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    this.date_jeu = date + " " + time;

    // récupérer l'id de joueur 
    this.user_id = JSON.parse(localStorage.getItem('user')).id;

    // Ma formule magique de calcul de score
    /*

       level = 1(facile) ou 2(intermedaiare) ou 3(difficile)
       nbReponsesCorrectes = nombre des réponses correctes
       nbQuestions = nombre des questions
       tempsTotal = temps total du quizz
    */
    //Math.round() retourne la valeur d'un nombre arrondi à l'entier le plus proche.
    this.score = Math.round((this.correctAnswers) * 10 *(this.level + (this.nbQuestions / this.timeElapsed)));
    this.quizService.score = this.score;
    this.compareScors();
  }
  // Cette fonction affiche un bandeau au cas ou vous avez dépasser votre meilleur score
  compareScors() {
    var a = JSON.parse(localStorage.getItem('scoreMax') || '{}');
    var b = this.score;
    if (b > a) {
      this.bandeauService.messageIn.next("Bravo! vous avez dépasser votre ancien score.");
      this.bandeauService.isLoged.next(true);
      this.bandeauService.style.next("success");
    }
    else {
      console.log("vous avez pas dépasser votre ancien score.");
    }

  }

  // Sauvegarde le resultat de  quiz dans l'historique
  saveResInHistorique(user_id: any, date_jeu: any, level: any, correctAnswers: any, timeElapsed: any, score: any) {

    // Recupperation des  quizz aprtir du theme
    this.http.post('http://pedago.univ-avignon.fr:3125/saveResInHistorique', {
      user_id, date_jeu,
      level, correctAnswers, timeElapsed, score
    }).subscribe((res: any) => {
      if (res) {
        // une notification de confirmation d'enregistrement
        this.bandeauService.messageIn.next("Le resultat de quiz à été bien enregistré.");
        this.bandeauService.isLoged.next(true);
        this.bandeauService.style.next("success");
        //affichage du profil utilisateur
        this._router.navigate(['/profil']);

      }

    }, (error) => {
      console.log(error);
    })


  }
  // relencer une autre partie
  restartQuiz() {
    this.bandeauService.messageIn.next("Bienvenue dans la nouvelle partie.");
    this.bandeauService.isLoged.next(true);
    this.bandeauService.style.next("success");
    this._router.navigate(['/quiz']);
  }

}
