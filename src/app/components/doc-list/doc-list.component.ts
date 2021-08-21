import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { DocService } from 'src/app/services/doc.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './doc-list.component.html',
  styleUrls: ['./doc-list.component.scss']
})
export class DocumentListComponent implements OnInit, OnDestroy {
  //holds all documents
  documents: Observable<string[]>;
  //current doc text
  currentDoc: string;
  //subscription for getting documents
  private _docSub: Subscription;

  constructor(private docService: DocService) { }

  ngOnInit() {
    //gets documents from server if there are existing ones
    this.documents = this.docService.documents;
    //gets current document
    this._docSub = this.docService.currentDocument.subscribe(doc => this.currentDoc = doc.id);
  }
  //unsubscribe when browser is closed
  ngOnDestroy() {
    this._docSub.unsubscribe();
  }
  //when user clicks on doc it gets doc from server through docService
  loadDoc(id: string) {
    this.docService.getDoc(id);
  }
  //when user wants to create a new document
  newDoc() {
    const username = prompt("Please enter a document name: ","");
    console.log(username);
    this.docService.makeDoc(username);
  }

}
