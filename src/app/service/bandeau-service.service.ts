import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BandeauServiceService {

  //déclaration
  public messageIn: BehaviorSubject<String>;
  public style: BehaviorSubject<String>;
  public isLoged: BehaviorSubject<boolean>;

  constructor() {
    //initialisation de type observable Contient la valeur à partager avec d'autres composants
    this.messageIn = new BehaviorSubject<String>("");
    this.style = new BehaviorSubject<String>("");
    this.isLoged = new BehaviorSubject<boolean>(false);
  }
}
