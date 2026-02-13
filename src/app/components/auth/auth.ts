import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  isLogin = true;
  email = ''; pass = ''; user = '';

  constructor(private service: ChatService, private router: Router) {
  }

  doLogin() {
    this.service.login({email: this.email, password: this.pass}).subscribe(res => {
      this.handleSuccess(res.user);
    });
  }
  doRegister() {
    this.service.register({username: this.user, email: this.email, password: this.pass}).subscribe(res => {
      this.handleSuccess(res.user);
    });
  }
  handleSuccess(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    this.service.currentUser$.next(user);
    this.router.navigate(['/mainframe']);
  }
}
