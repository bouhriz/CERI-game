import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Authentification {
  date1: string;

  constructor(private _http: HttpClient) {
  }

  last_connexion = new Date()

  IsLogged(): boolean {
    if (JSON.parse(localStorage.getItem('user') || '{}').status_de_connexion)
      return true;
    else
      return false;
  };


  VerifyId(username: any, password: any): Observable<boolean> {
    var trueId: boolean = false;
    // la méthode renvoie un observable et un booléen en données
    return Observable.create((observer: Subscriber<boolean>) => {
      this._http.post<any>('http://pedago.univ-avignon.fr:3125/login', { username, password }).subscribe(
        data => {
          console.log(data);
          // succes de l’observable httpClient
          if (data.status_de_connexion) {

            localStorage.setItem('user', JSON.stringify(data));

            var date = this.last_connexion.getDate() + "/" + (this.last_connexion.getMonth() + 1) + "/" + this.last_connexion.getFullYear() + "  " +
              this.last_connexion.getHours() + ":" + this.last_connexion.getMinutes();
            this.date1 = localStorage.getItem(data.id);
            localStorage.setItem(data.id, JSON.stringify(date))
            trueId = true;
          }
          else {
            trueId = false;
          }
        },
        error => {// erreur de l’observable httpClient
          console.error('une erreur est survenue!', error);

          //trueId = false;
        },
        () => {// terminaison de l’observable httpClient
          observer.next(trueId); // renvoi des données pour l’observable principal
        }
      );
    });

  }
  // deconnexion
  signOutAPI(id: String) {
    return this._http.post(`http://pedago.univ-avignon.fr:3125/logout`, { id });
  }
  // modifier le profil
  updateProfil(id: string, avatar: string) {
    return this._http.post(`http://pedago.univ-avignon.fr:3125/update`, { id, avatar });
  }


}
