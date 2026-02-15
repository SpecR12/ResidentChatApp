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
  //access direct la containerul de mesaje din HTML pentru manipularea scroll-ului
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  messages: Message[] = [];
  txtMessage = '';
  currentUser: User | null = null;

  //observator pentru a urmari detectia mesajelor, pentru update la mesaje fara sa mai verifice angular
  private mutationObserver: MutationObserver | null = null;

  constructor(
    private service: ChatService,
    private cdr: ChangeDetectorRef // pentru a forța actualizarea UI-ului manual
  ) {}

  //abordare flux de date
  ngOnInit() {
    this.currentUser = this.service.currentUser$.value;
    this.service.connect();

    //actualizare historic
    this.service.getHistory().subscribe(msg => {
      this.messages = msg;
      this.cdr.detectChanges(); //fortam angular sa randeze html
      this.scrollToBottom(false); //fara scroll instant
    });

    //actualizare mesaje
    this.service.getMessages().subscribe(msg => {
      this.messages.push(msg);
      this.cdr.detectChanges();
      setTimeout(() => {
        this.scrollToBottom(true);
      }, 250); // scroll lin (smooth)
    });
  }

  ngAfterViewInit() {
    if (this.scrollContainer) {
      //observator care se uita la containerul de chat
      this.mutationObserver = new MutationObserver(() => {
        //de fiecare dată când structura HTML se schimbă (apare un div nou), facem scroll
        this.scrollToBottom(true);
      });

      //activam observatorul
      this.mutationObserver.observe(this.scrollContainer.nativeElement, {
        childList: true, //urmareste adaugarea de mesaje
        subtree: true //urmareste si in adancime
      });
    }
  }

  ngOnDestroy() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }

  send() {
    if (!this.txtMessage.trim()) return; //fara mesaje goale/spatii
    this.service.sendMessage(this.txtMessage);
    this.txtMessage = '';
  }

  //helper pentru scroll
  scrollToBottom(smooth: boolean = true): void {
    try {
      const el = this.scrollContainer.nativeElement;
      el.scrollTo({
        top: el.scrollHeight, //merge la inaltime maxima
        behavior: smooth ? 'smooth' : 'auto'
      });
    } catch (err) { } //ignor erorile din dom
  }

  logout(){
    this.service.logout();
  }
}
