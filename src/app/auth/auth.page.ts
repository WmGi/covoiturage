/* eslint-disable max-len */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable no-var */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/quotes */
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AngularFireStorage } from 'angularfire2/storage';
import { AuthService ,AuthResponseData} from './auth.service';
import {AngularFireAuth } from 'angularfire2/auth';
import { BehaviorSubject, from, Observable } from 'rxjs';
import * as firebase from 'firebase';
import { createViewChild } from '@angular/compiler/src/core';
import { AngularFirestore } from '@angular/fire/firestore';
//import { User } from './user.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
 // private _user = new BehaviorSubject<User>(null);
  titre: string;
  isLoading=false;
  isLogin = true;
  selectedOption: string;
  named: string;
  constructor(private fireauth: AngularFireAuth, private firestore: AngularFirestore,private storage: AngularFireStorage,
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private zone: NgZone

  ) {}
  ngOnInit() {}
  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then(loadingEl => {
        loadingEl.present();
        if (this.isLogin) {
          this.authService.login(email, password).then( resData => {
            console.log(resData);
            if(!resData.user.emailVerified){
              throw  new Error('is not verified');
            }else{
            this.authService.setState(this.fireauth.auth.currentUser.email);
            this.authService.setStateb();

            this.isLoading = false;
            loadingEl.dismiss();
            this.router.navigateByUrl('/trip/tabs/discover');}
          }).catch(errRes => {
            loadingEl.dismiss();
            const code = errRes;
            const message = 'Could not sign in, please try again.';
            this.showAlert(message);
          });
        } else {
         this.authService.signup(email, password).then(resData => {
          this.firestore.collection('comptes').add({
            email:email
          }).then(docRef =>{

         });
          console.log(resData);
          resData.user.sendEmailVerification().then();
          this.isLoading = false;
          loadingEl.dismiss();
          const message = 'check your email an email is sent';
          this.showAlertOK(message);
        }).catch(errRes => {
          console.log(errRes);
          loadingEl.dismiss();
          const message = 'Could not sign you up, please try again.';
          this.showAlert(message);
        });
        }
      });
  }
  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authentication failed',
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }
  private showAlertOK(message: string) {
    this.alertCtrl
      .create({
        header: 'thank you ',
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }
  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }
  facebooksign(){
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
      console.log('log out');
    }).catch((error) => {
      // An error happened.
    });
  }
  facebook(){
    var user: any;
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('user_birthday');
    provider.addScope('email');

    firebase.auth().signInWithRedirect(provider);

 /*this.zone.run(() => {
 firebase
  .auth()
  .signInWithPopup(provider)
  .then(async (result) => {
    user = result.user;

    /* @type {firebase.auth.OAuthCredential}
    var credential = await result.credential as firebase.auth.OAuthCredential;
    console.log(this.fireauth.auth.currentUser.email);

    // The signed-in user info.
     user = result.user;

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var accessToken = credential.accessToken;
console.log(user)
console.log(result.additionalUserInfo.profile['email'])
this.authService.setState(result.additionalUserInfo.profile['email']);
this.authService.setStateb();

  this.router.navigateByUrl('/trip/tabs/discover');
});


    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the
    console.log(errorCode);
    console.log(errorMessage);
    console.log(user);


  }
  )*/
  /*this.zone.run(() => {
  firebase.auth()
  .getRedirectResult()
  .then(async (result) => {
      /** @type {firebase.auth.OAuthCredential}
      var credential = await result.credential  as firebase.auth.OAuthCredential;

      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = credential.accessToken;
      // ...
        console.log(token)
        let data  = ''

        // eslint-disable-next-line max-len
        // eslint-disable-next-line max-len
        fetch(' https://graph.facebook.com/v10.0/me?fields=id%2Cname%2Cemail&access_token=EAACAf0xrlHYBADXMkrLzyrMNybkqEPozsEDplhRZALygtEFI1YCUYZCEgybX3FdFgvh9FJHZC41GQWLkwQ8WN5cyBZAtVBDoZBF3KMDZCbtttFO4MZCqFH9xCiTYECR2xMKJMj7mQwGg4BFeOfcwILs7gmWBZBQ913114ZB1HJKbYgi47qxg7Io9ZAZBv4ZCkReijujfAfTZBb3jU7FqjGCjEsZBSDpfq8XRV7NITsxsG8A3o262HCJLpVxNzS')
         .then(function(response) {
           return response.json();
         })
         .then(function(myJson) {

           data=myJson
        console.log(data)
        this.router.navigateByUrl('/trip/tabs/discover');

         });
    // The signed-in user info.
     user = result.user;
  }).catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    console.log(errorMessage)
    console.log(errorCode)
    console.log(email)

    console.log("errorMessage")

    // ...
  });
});*/
}
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    console.log(form);
    const email = form.value.email;
    const password = form.value.password;
    const name = form.value.named;
    console.log('youre name'+name)


    this.authenticate(email, password);

  }
  bomba(){
   this.firestore.collection("produit").add({titraaa:this.titre});
   this.router.navigateByUrl('/auth');

  }
  foo(email: string){
  }
  }


