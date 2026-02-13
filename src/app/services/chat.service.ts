import {Injectable, NgZone} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {io, Socket} from 'socket.io-client';
import {Observable, BehaviorSubject} from 'rxjs';
import {User, Message} from '../models/chat.models';

@Injectable({providedIn: 'root'})
export class ChatService {
  private apiUrl = 'http://localhost:3000/api';
  private socket!: Socket;

  public currentUser$ = new BehaviorSubject<User | null>(null);

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

  checkCode(code: string) { return this.http.post<any>(`${this.apiUrl}/check-code`, { code }); }
  login(data: any) { return this.http.post<any>(`${this.apiUrl}/login`, data); }
  register(data: any) { return this.http.post<any>(`${this.apiUrl}/register`, data); }

  connect(){
    this.socket = io('http://localhost:3000', {
      transports: ['websocket']
    });
    const user = this.currentUser$.value;
    if (user){
      this.socket.emit('join', user);
    }
  }

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

  getMessages() {
    return new Observable<Message>(observer => {
      this.socket.on('newMessage', (data) => {
        this.ngZone.run(() => {
          observer.next(data);
        });
      });
    });
  }

  getHistory() {
    return new Observable<Message[]>(observer => {
      this.socket.on('history', (data) => {
        this.ngZone.run(() => {
          observer.next(data);
        });
      });
    });
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser$.next(null);
    window.location.reload();
  }
}
