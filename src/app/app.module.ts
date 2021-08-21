import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AppComponent } from './app.component';
import { DocumentListComponent } from './components/doc-list/doc-list.component';
import { DocumentComponent } from './components/doc/doc.component';
import { ChatComponent } from './components/chat/chat.component'

const config: SocketIoConfig = { url: 'http://192.168.0.130:4200', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    DocumentListComponent,
    DocumentComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
