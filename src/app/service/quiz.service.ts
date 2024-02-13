import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  themes: any;
  quiz: any;

  // score de l'utilsateur dans une partie
  score: any;

  // progressement de question
  questionProgress: number;

  //nombre de reponses corrects
  correctAnswerCount: number = 0;

  // Temps total du quiz pris par l'utlisateur
  seconds: number;

  // temps pris pour chaque question
  timer: number;

  // niveau de jeu (initialiser par le niveau facile)
  level: any = 1;

  // choix de theme
  theme: any = 1;

  // tableau en stockant les choix de joueur
  choix: any = [];

  // tableau en stockant des id avec des reponses corrects
  correct: any = [];



  constructor(private http: HttpClient) { }

  getQuizByTheme(theme: String, level: any) {
    return this.http.post(`http://pedago.univ-avignon.fr:3125/getQuizByTheme`, { theme, level });
  }

  // affichage de temps écoulé (minutes : seconds)
  displayTimeElapsed() {
    return Math.floor(this.seconds / 3600) + ':' + Math.floor(this.seconds / 60) + ':' + Math.floor(this.seconds % 60);
  }

  // affiche le nom du joueur 
  getPlayer() {
    return JSON.parse(localStorage.getItem('user')).nom + " " +
      JSON.parse(localStorage.getItem('user')).prenom;
  }
  getHistoriqueById(user_id: any) {
    return this.http.post(`http://pedago.univ-avignon.fr:3125/getHistoriqueById`, { user_id });
  }



}
