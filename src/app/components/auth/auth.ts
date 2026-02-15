import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule], //formsmodule pentru ngModel
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  isLogin = true;
  email = ''; pass = ''; user = '';

  //chatservice pentru a vorbi cu serverul, router pentru redirectionare
  constructor(private service: ChatService, private router: Router) {
  }

  //functie de login (email si parola) citeste din users.json
  doLogin() {
    this.service.login({email: this.email, password: this.pass}).subscribe(res => {
      this.handleSuccess(res.user);
    });
  }

  //functie de register (username, email, parola) scrie in users.json
  doRegister() {
    this.service.register({username: this.user, email: this.email, password: this.pass}).subscribe(res => {
      this.handleSuccess(res.user);
    });
  }

  //metoda helper: se executa atunci cand confirma cu userul e valid
  handleSuccess(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    this.service.currentUser$.next(user);
    this.router.navigate(['/mainframe']);
  }
}
