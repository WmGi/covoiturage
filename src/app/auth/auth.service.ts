/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { AngularFireAuth } from 'angularfire2/auth';
export interface AuthResponseData {
  user: string ;additionalUserInfo: string; operationType: string;

}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userIsAuthenticated = true;
  private  _userId = null;

  get userId() {
    return this._userId;
  }


  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  constructor(private fire: AngularFireAuth) {}
  setState(user: string){
    this._userId=user;
  }
  setStateb(){
    this._userIsAuthenticated=true;
  }

signup(email: string, password: string){
 return this.fire.auth.createUserWithEmailAndPassword(email,password);

}

  login(email: string, password: string) {
   return this.fire.auth.signInWithEmailAndPassword(email,password);  }

  logout() {
    this._userIsAuthenticated = false;
    this._userId = null;

    Plugins.Storage.clear();

  }
}
