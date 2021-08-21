import { Component, OnInit, OnDestroy } from '@angular/core';
import { DocService } from 'src/app/services/doc.service';
import { Subscription } from 'rxjs';
import { Document } from 'src/app/models/doc';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'app-document',
  templateUrl: './doc.component.html',
  styleUrls: ['./doc.component.scss']
})
export class DocumentComponent implements OnInit, OnDestroy {
  //current document holder
  document: Document;
  //subscription for document
  private _docSub: Subscription;
  //font selector string
  public selectedFont: string;
  //dark mode bool
  isDark : boolean = false;
  constructor(private docService: DocService) { }

  ngOnInit() {
    //get starting page
    this._docSub = this.docService.currentDocument.pipe(
      startWith({ id: '', doc: 'Click New Document button on the left to start using the app'})
    ).subscribe(document => this.document = document);
  }
  //dark mode
  darkFun() {
    var element = document.getElementById("output-text");
    element.classList.toggle("dark_mode");
    this.isDark = !this.isDark;
  }
  //change fonts
  changeFont(){
    document.getElementById("output-text").style.fontFamily = this.selectedFont;
  }
  //unsubscribe when browser is closed
  ngOnDestroy() {
    this._docSub.unsubscribe();
  }
  //sends edits to server
  editDoc() {
    this.docService.editDoc(this.document);
  }
}
