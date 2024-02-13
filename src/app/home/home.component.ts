import { Component, OnInit } from '@angular/core';
import { Authentification } from '../service/authentification.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  auth: Authentification;

  constructor(private _auth: Authentification) {
    this.auth=_auth;
   }

  ngOnInit(): void {
  }

}
