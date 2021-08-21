import { Component, OnInit } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { DocService } from './services/doc.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private docService: DocService) { }
  //gets call for server closing
  closing: Observable<string>;
  //helps with function call every 1 sec
  subscription: Subscription;

  ngOnInit() { 
    //checks if server closed
    this.checkClosed();
    //1000 = 1s allows call every second
    const source = interval(1000);
    //calls checkClosed every second
    this.subscription = source.subscribe(val => this.checkClosed());
   }
   //function checks if server is gone and alers the message
   checkClosed() {
    this.closing = this.docService.closing;
    this.closing.forEach( (close) => {
      if(close !== undefined) {
        alert(close);
      }
    });
   }

  ngOnDestroy() {
    this.docService.leave();
    this.subscription && this.subscription.unsubscribe();
  }
}
