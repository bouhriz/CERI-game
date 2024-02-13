import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router'
import { BandeauServiceService } from './service/bandeau-service.service';
import { Authentification } from './service/authentification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CeriGame';

  auth: Authentification;
  constructor(_auth: Authentification, _http: HttpClient, private _router: Router, private bandeauService: BandeauServiceService) { // Injection du service dans le constructeur du composant
    this.auth = _auth

  }
  ngOnInit(): void {
  }

  // déconnexion de l'utilisateur
  signOut() {

    this.auth.signOutAPI(JSON.parse(localStorage.getItem('user') || '{}').id).subscribe(
      (response: any) => {
        if (response === true) {

          // supprimer les donnees de l'utilisateur dans le localStorage avec id user
          localStorage.removeItem('user');
          // bandeau au cas de deconnexion
          this.bandeauService.style.next("success");
          this.bandeauService.messageIn.next("vous êtes déconnecté");

          // Redériger l'utilisateur vers la page de connexion
          this._router.navigate(['/login']);
        }
      }, (error: any) => {
        console.log('Error is : ', error);
      })

  }

}
