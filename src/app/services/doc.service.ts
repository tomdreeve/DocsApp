import { Injectable } from '@angular/core';

import { Socket } from 'ngx-socket-io';

import { Document } from '../models/doc';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class DocService {
  //gets current document, list of documents, chat messages, closing
  currentDocument = this.socket.fromEvent<Document>('document');
  documents = this.socket.fromEvent<string[]>('documents');
  messages = this.socket.fromEvent<Message[]>('messages');
  closing = this.socket.fromEvent<string>('closing');

  constructor(private socket: Socket) { }
  //asks server to get document
  getDoc(id: string) {
    this.socket.emit('getDoc', id);
  }
  //makes document
  makeDoc(username) {
    this.socket.emit('addDoc', { id: username, doc: '' });
  }
  //when user edits document
  editDoc(document: Document) {
    this.socket.emit('editDoc', document);
  }
  //send chat message
  sendMessage(message: string, username){
    this.socket.emit('newMessage', {message: message, username: username});
  }
  //when user quits
  leave(){
    this.socket.emit('close');
  }
}
