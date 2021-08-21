import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from 'src/app/models/message';
import { DocService } from '../../services/doc.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  //holds message from server if server is terminated
  message: string;
  //messages that come from server in chat
  messages: Observable<Message[]>;
  constructor(private docService: DocService) { }

  ngOnInit() {
    //gets messages from docService
    this.messages = this.docService.messages;
    }

  //sends message to all users + calls send message from docService
  sendMessage() {
    const username = prompt("Please enter a username: ","");
    console.log(username);
    this.docService.sendMessage(this.message, username);
    this.message = "";
  }
  
}
