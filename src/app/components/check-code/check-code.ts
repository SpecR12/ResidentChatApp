import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {ChatService} from '../../services/chat.service';

@Component({
  selector: 'app-check-code',
  standalone: true,
  imports: [
    CommonModule, FormsModule
  ],
  templateUrl: './check-code.html',
  styleUrl: './check-code.css',
})
export class CheckCode {
  code = '';
  error = false;
  constructor(private service: ChatService, private router: Router) {}

  verify(){
    this.service.checkCode(this.code).subscribe({
      next: () => {
        sessionStorage.setItem('blockAccess', 'true');
        this.router.navigate(['/auth']);
      },
      error: () => this.error = true
    });
  }
}
