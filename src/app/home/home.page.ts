/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/quotes */
import { Component } from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';
import { BookingService } from '../bookings/booking.service';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Booking } from '../bookings/booking.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
 email: string;
 password: string;
 isLoading= false;
 loadedBookings: Booking[];
 loadedBookings2: Booking[];

 private bookingSub: Subscription;
  constructor(private fire: AngularFireAuth,private router: Router ,
   private bookingService: BookingService,  private loadingCtrl: LoadingController
   ) {}
   ngOnInit() {
    this.bookingService.bookings.subscribe(bookings => {
      this.loadedBookings = bookings;

    });
    this.bookingService.bookings2.subscribe(bookings => {
      this.loadedBookings2 = bookings;

    });

  }
  ionViewWillEnter() {
    this.isLoading = true;
    this.bookingService.fetchBookings().subscribe(() => {

    });
    this.bookingService.fetchBookingsd().subscribe(() => {
      this.isLoading = false;
    });
  }


  onCancelBooking(bookingId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    this.loadingCtrl.create({ message: 'Cancelling...' }).then(loadingEl => {
      loadingEl.present();
      this.bookingService.cancelBooking(bookingId).subscribe(() => {
        loadingEl.dismiss();
      });
    });
  }

  ngOnDestroy() {
    if (this.bookingSub) {
      this.bookingSub.unsubscribe();
    }
  }

}
