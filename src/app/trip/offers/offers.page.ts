/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Trip } from '../trip.model';
import { TripService } from '../trip.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit ,OnDestroy {

  offers: Trip[];
  tripsSub: Subscription;
  isLoading = false;
  auth= null;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  constructor(private tripService: TripService,
    private loadingCtrl: LoadingController,
    private router: Router,private Auth: AuthService) { }

  ngOnInit() {
    this.auth=this.Auth.userId;
    this.tripsSub = this.tripService.trips.subscribe(trips =>
      { this.offers = trips;
      });
  }
  ionViewWillEnter() {
    console.log(this.auth);
    console.log(this.Auth.userId);

    this.isLoading = true;
    this.tripService.fetchTrips().subscribe(() =>
      {
      this.isLoading = false;
    });
  }
  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();//nsaker biha sliding item bech man5allihouch ma7loul
    this.router.navigate(['/', 'trip', 'tabs', 'offers', 'edit', offerId]);
    console.log('Editing item', offerId); //ntesti biha id mte3 offer
  }
  ngOnDestroy() {
    if (this.tripsSub) {
      this.tripsSub.unsubscribe();
    }
  }
  onCancelOffer(bookingId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    this.loadingCtrl.create({ message: 'Cancelling...' }).then(loadingEl => {
      loadingEl.present();
      this.tripService.cancelOffer(bookingId).subscribe(() => {
        loadingEl.dismiss();
      });
    });
  }
}
