import {Injectable, NgZone} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {io, Socket} from 'socket.io-client';
import {Observable, BehaviorSubject} from 'rxjs';
import {User, Message} from '../models/chat.models';

//serviciul central care face comunicare frontend/backend
@Injectable({providedIn: 'root'})
export class ChatService {
  private apiUrl = 'http://localhost:3000/api';
  private socket!: Socket;

  //variabila care permite oricarei componente sa stie daca userul este logat sau nu
  public currentUser$ = new BehaviorSubject<User | null>(null);

  //ngzone pentru a rezolva problema sincronizarii cu socket.io cu angular
  //verificam localstorage la initializare pentru a mentine utilizatorul logat chiar daca da refresh la pagina
  constructor(private http: HttpClient, private ngZone: NgZone) {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        this.currentUser$.next(user);
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }

  //functii pentru control server/client
  checkCode(code: string) { return this.http.post<any>(`${this.apiUrl}/check-code`, { code }); }
  login(data: any) { return this.http.post<any>(`${this.apiUrl}/login`, data); }
  register(data: any) { return this.http.post<any>(`${this.apiUrl}/register`, data); }

  //conectare server.js
  connect(){
    this.socket = io('http://localhost:3000', {
      transports: ['websocket']
    });
    const user = this.currentUser$.value;
    if (user){
      this.socket.emit('join', user);
    }
  }

  //functie de trimitere mesaj
  sendMessage(content: string) {
    const user = this.currentUser$.value;
    if (!user) return;

    const msg = {
      senderId: user.id,
      senderName: user.username,
      senderColor: user.avatarColor,
      content: content,
      type: 'TEXT'
    };
    this.socket.emit('sendMessage', msg);
  }

  //functie getter mesaje (pentru mesaje noi), returnez un obsevable la care toate componentele se pot abona
  getMessages() {
    return new Observable<Message>(observer => {
      this.socket.on('newMessage', (data) => {
        this.ngZone.run(() => {
          observer.next(data);
        });
      });
    });
  }

  //functie getter istoric (primeste lista completa de mesaje anterioare la conectare) ATENTIE! atata timp cat serverul este deschis, daca e inchis ciao ciao istoric.
  getHistory() {
    return new Observable<Message[]>(observer => {
      this.socket.on('history', (data) => {
        this.ngZone.run(() => {
          observer.next(data);
        });
      });
    });
  }

  //functie logout (sterge date locale)
  logout() {
    localStorage.removeItem('user');
    this.currentUser$.next(null);
    window.location.reload();
  }
}
