import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { Message, User } from '../../models/chat.models';

@Component({
  selector: 'app-mainframe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mainframe.html',
  styleUrl: './mainframe.css',
})
export class Mainframe implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  messages: Message[] = [];
  txtMessage = '';
  currentUser: User | null = null;

  private mutationObserver: MutationObserver | null = null;

  constructor(
    private service: ChatService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.currentUser = this.service.currentUser$.value;
    this.service.connect();

    this.service.getHistory().subscribe(msg => {
      this.messages = msg;
      this.cdr.detectChanges();
      this.scrollToBottom(false);
    });

    this.service.getMessages().subscribe(msg => {
      this.messages.push(msg);
      this.cdr.detectChanges();
      setTimeout(() => {
        this.scrollToBottom(true);
      }, 250);
    });
  }

  ngAfterViewInit() {
    if (this.scrollContainer) {
      this.mutationObserver = new MutationObserver(() => {
        this.scrollToBottom(true);
      });

      this.mutationObserver.observe(this.scrollContainer.nativeElement, {
        childList: true,
        subtree: true
      });
    }
  }

  ngOnDestroy() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }

  send() {
    if (!this.txtMessage.trim()) return;
    this.service.sendMessage(this.txtMessage);
    this.txtMessage = '';
  }

  scrollToBottom(smooth: boolean = true): void {
    try {
      const el = this.scrollContainer.nativeElement;
      el.scrollTo({
        top: el.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      });
    } catch (err) { }
  }

  logout(){
    this.service.logout();
  }
}
