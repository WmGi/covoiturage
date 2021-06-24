/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';//ne7it router 5ater masta3malthach
import { ActionSheetController, AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { BookingService } from 'src/app/bookings/booking.service';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { Trip } from '../../trip.model';
import { TripService } from '../../trip.service';
import { AngularFireDatabase } from '@angular/fire/database';

//import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.page.html',
  styleUrls: ['./trip-detail.page.scss'],
})
export class TripDetailPage implements OnInit ,OnDestroy {
  trip: Trip;
  isBookable = false;
  isLoading=false;
  auther=this.auth.userId;
 private tripSub: Subscription;
  constructor(private router: ActivatedRoute, private navCtrl: NavController ,private tripService: TripService,
    private modalCtrl: ModalController ,
    private actionSheetCtrl: ActionSheetController,
     private bookingService: BookingService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private route: Router,private auth: AuthService,
    private Ang: AngularFireDatabase

) {}


ngOnInit() {
  this.router.paramMap.subscribe(paramMap => { //paramap ta3tini objet observable na3mel 3lih subscribe bech najem nesta3mel ili fih
    if (!paramMap.has('tripId')) {
      this.navCtrl.navigateBack('/trip/tabs/discover');
      return;
    }
    this.isLoading=true;
    console.log('ya=eah'+paramMap.get('tripId'));
    console.log(this.tripService.getTrip(paramMap.get('tripId')));
    this.tripSub = this.tripService
    .getTrip(paramMap.get('tripId'))
    .subscribe(
      place => {
        this.trip = place;
        this.isBookable = place.userId !== this.authService.userId;
        this.isLoading = false;
      },
      error => {
        this.alertCtrl
          .create({
            header: 'An error ocurred!',
            message: 'Could not load place.',
            buttons: [
              {
                text: 'Okay',
                handler: () => {
                  this.route.navigate(['/', 'trip', 'tabs', 'discover']);
                }
              }
            ]
          })
          .then(alertEl => alertEl.present());
      }
    );
});

  };
/*call(){
  this.callNumber.callNumber(this.trip.tel.toString(), true)
  .then(res => console.log('Launched dialer!', res))
  .catch(err => console.log('Error launching dialer', err));
}*/

onBookPlace() {
  // this.router.navigateByUrl('/places/tabs/discover');
  // this.navCtrl.navigateBack('/places/tabs/discover');
  // this.navCtrl.pop();
  this.actionSheetCtrl
    .create({
      header: 'Choose an Action',
      buttons: [
        {
          text: 'Select Date',
          handler: () => {
            console.log('select');
            this.modalCtrl
              .create({
                component: CreateBookingComponent,
                componentProps: { selectedTrip: this.trip } //selectedTrip mte3 create-booking fi create-booking.page
              })
              .then(modalEl => {
                modalEl.present();
                return modalEl.onDidDismiss();
              })
              .then(resultData => {
                console.log(resultData.data, resultData.role);
                if (resultData.role === 'confirm') {
                  this.loadingCtrl
                  .create({ message: 'Booking place...' })
                  .then(loadingEl => {
                    loadingEl.present();
                    const data = resultData.data.bookingData;
                    console.log('no one'+this.trip.arrivee);
                    console.log('object: %O', this.trip );

                    this.bookingService
                      .addBooking(
                        this.trip.conduit,
                        this.trip.id,
                        this.trip.title,
                        this.trip.imageUrl,
                        data.firstName,
                        data.lastName,
                        data.guestNumber,
                        data.tel,
                      )
                      .subscribe(() => {
                        loadingEl.dismiss();
                      });
                  });
                }
              });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    })
    .then(actionSheetEl => {
      actionSheetEl.present();
    });
}
ngOnDestroy() {
  if (this.tripSub) {
    this.tripSub.unsubscribe();
  }
}
openBookingModal(mode: 'select') {
  console.log(mode);
  this.modalCtrl
    .create({
      component: CreateBookingComponent,
      componentProps: { selectedPlace: this.trip, selectedMode: mode }
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(resultData => {
      if (resultData.role === 'confirm') {
        this.loadingCtrl
          .create({ message: 'Booking place...' })
          .then(loadingEl => {
            loadingEl.present();
            const data = resultData.data.bookingData;
            console.log('no one'+this.trip);
            this.bookingService
              .addBooking(
                this.trip.conduit,
                this.trip.id,
                this.trip.title,
                this.trip.imageUrl,
                data.firstName,
                data.lastName,
                data.guestNumber,
                data.startDate,
              )
              .subscribe(() => {
                loadingEl.dismiss();
              });
          });
      }
    });
}



}
