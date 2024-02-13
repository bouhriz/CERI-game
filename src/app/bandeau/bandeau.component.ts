import { Component, OnInit } from '@angular/core';
import { BandeauServiceService } from '../service/bandeau-service.service';

@Component({
  selector: 'app-bandeau',
  templateUrl: './bandeau.component.html',
  styleUrls: ['./bandeau.component.css']
})
export class BandeauComponent implements OnInit {


  //déclaration des variables de beandeau
  messageIn: any = '';
  isLoged: boolean = false;
  style: String = '';

  constructor(private bandeauService: BandeauServiceService) {

    /* 
    subscribe est un observable qui nous retourne des données
     dans ce cas le style, le message et authentification pour chaque nouvelle notification
    */
    this.bandeauService.isLoged.subscribe(data => {
      this.isLoged = data;
    });

    this.bandeauService.messageIn.subscribe(data => {
      this.messageIn = data;
    });

    this.bandeauService.style.subscribe(data => {
      this.style = data;
    });

  }

  ngOnInit(): void { }
}
