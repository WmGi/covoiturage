/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable eqeqeq */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/core';

import { MenuController } from '@ionic/angular';
import { Trip } from '../trip.model';
import { TripService } from '../trip.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit ,OnDestroy{
  loadedtrip: Trip[];
  listedLoadedtrip: Trip[];
  listedLoadedtripse: Trip[];
  tripsSub: Subscription;
  isLoading = false;
  entry=false;
  depart='Tunis';
  arrivee='Sfax';

  constructor(private auth: AuthService,
   private tripService: TripService,
    private menuCtrl: MenuController
  ) {}

  ngOnInit() {
console.log(this.auth.userIsAuthenticated);
    this.tripsSub = this.tripService.trips.subscribe(trips => {
      this.loadedtrip = trips;//trips jeya min get trips ili mawjouda fi TripService
       this.listedLoadedtrip = this.loadedtrip.slice(1);
    });


  }
  onChange($event){
    console.log($event.target.value);
    this.listedLoadedtripse=[];
    this.listedLoadedtrip.forEach(element => {
  if(element.depart.toString()===this.depart && element.arrivee.toString()===this.arrivee){
        this.listedLoadedtripse.push(element);
        console.log(element.arrivee.toString());

  }
});
    }

  search() {
    this.entry = !this.entry;
  }
  ionViewWillEnter() {
    console.log( 'loading: '+this.isLoading);

    this.isLoading = true;
    console.log( 'loading: '+this.isLoading);

    this.tripService.fetchTrips().subscribe(() =>
    this.isLoading = false
    );

    console.log( 'loading: '+this.isLoading);


  }
  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    console.log(event.detail);
  }
  ngOnDestroy() {
    console.log('isdestroyed');

    if (this.tripsSub) {
      this.tripsSub.unsubscribe();
    }
  }
}
