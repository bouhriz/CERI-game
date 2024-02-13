import { Component, OnInit } from '@angular/core';
import { Authentification } from '../service/authentification.service'
import { FormGroup } from '@angular/forms';
import { BandeauServiceService } from '../service/bandeau-service.service';
import { Router } from '@angular/router'
import { WebSocketService } from '../service/web-socket.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  // l'utilisateur connecté
  user: any = {};
  isLogged: boolean = false;
  date1: string;
  // inject dependencies into the component class
  constructor(private _auth: Authentification, private bandeauService: BandeauServiceService, private _router: Router, private socketService: WebSocketService) { }

  ngOnInit(): void {
    this.test();
  }

  loginUser() {
    this._auth.VerifyId(this.user.username, this.user.password).subscribe(
      data => {
        this.isLogged = data;
        if (this.isLogged == true) {
          // Notification en cas de mot de passe ou login sont corrects
          this.bandeauService.isLoged.next(true);
          this.bandeauService.style.next("success");
          this.bandeauService.messageIn.next("Bienvenue " + this.user.username + ", dérniere connexion le : " + (this._auth.date1).slice(1, -1));
          //navigate to profil

          this._router.navigate(['/home']);
        }
        else {
          // Notification en cas de mot de passe ou login sont erronés
          this.bandeauService.messageIn.next("Identifiant ou mot de passe incorrect");
          this.bandeauService.isLoged.next(true);
          this.bandeauService.style.next("danger");
        }
      },
      error => {
      }
    );
  }
  test() {
    console.log("clicked")
    //this.socketService.listen("messageClient");
    this.socketService.emit("messageClient", "test c'est ca marche");
    this.socketService.listen("notification").subscribe((data) => {
      console.log(data);
    }, error =>
    console.log("error")

    )
  }

}
