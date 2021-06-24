/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/quotes */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import {AngularFireModule} from 'angularfire2';
import{AngularFireAuth, AngularFireAuthModule} from 'angularfire2/auth';
import{AngularFirestoreModule } from 'angularfire2/firestore';
import{AngularFireStorageModule } from 'angularfire2/storage';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireDatabaseModule } from 'angularfire2/database';


import { HttpClientModule } from '@angular/common/http';
import { Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;
 const firebaseConfig = {
  apiKey: "AIzaSyALqXywJOq3JpL-HPGS0UqnUrpj4wvJDE4",
  authDomain: "testauth-8c814.firebaseapp.com",
  projectId: "testauth-8c814",
  storageBucket: "testauth-8c814.appspot.com",
  messagingSenderId: "827641779900",
  appId: "1:827641779900:web:94687fc3d6a8b6f8ba22b9",
  measurementId: "G-RQ2DFJ15H4"
};
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(),
    AppRoutingModule,AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,AngularFirestoreModule,AngularFireStorageModule,
    HttpClientModule,
    AppRoutingModule, AngularFireDatabaseModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },],
  bootstrap: [AppComponent],
})
export class AppModule {}
