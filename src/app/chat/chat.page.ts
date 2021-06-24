/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
 id: string;
 messageText: any;
 public messages: any = [];
 userId: any;
   constructor(private act: ActivatedRoute,
    private auth: AuthService,
    private ang: AngularFireDatabase) {
    this.id=this.act.snapshot.params["chatid"];
    this.userId=this.auth.userId;
 }

  ngOnInit() {
    this.getMessages();
    console.log(  "hey"+this.id);
  }
  sendMessage() {
    this.ang.list('Messages/').push({
      userId: this.auth.userId,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      To:  this.id,
      text: this.messageText,
      date: new Date().toISOString()
    });
    this.messageText = '';
  }
  getMessages() {
    this.ang.list('Messages/',
     ref => ref.orderByChild('date')).snapshotChanges(['child_added'])
    .subscribe(actions => {
      this.messages = [];
      actions.forEach(action => {
        // eslint-disable-next-line eqeqeq
        if((action.payload.exportVal().userId == this.userId ||
         this.userId ==action.payload.exportVal().To) &&
         // eslint-disable-next-line eqeqeq
         (action.payload.exportVal().userId==this.id ||
          this.id ==  action.payload.exportVal().To) ){
        this.messages.push({
          userId: action.payload.exportVal().userId,
          To: action.payload.exportVal().To,

          text: action.payload.exportVal().text,
          date: action.payload.exportVal().date
        });}
      });
    });
  }

}
