import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  socket: any;

  constructor() {
    this.socket = io('http://pedago01c.univ-avignon.fr:3125', { transports: ['websocket'] });

  }

  // Méthode d’écoute des événements venant du serveur (utilisation des observables pour activation dès réception d’un événement!) en s’appuyant sur socket.io-client
  listen(eventname: string): Observable<any> {
    return new Observable((subscribe) => {
      this.socket.on(eventname, (data: any) => {
        console.log(data);
        subscribe.next(data);
      }, (error: any) => {
        console.log(error)
      }

      )
    })
  }
  // Méthode d’envoi au serveur d’un événement et données associées en s’appuyant sur socket.io-client
  emit(eventname: string, data: any) {
    this.socket.emit(eventname, data);
  }
}
