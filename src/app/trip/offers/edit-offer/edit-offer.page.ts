import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { delay, take, tap } from 'rxjs/operators';
import { Trip } from '../../trip.model';
import { TripService } from '../../trip.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit ,OnDestroy {
  trip: Trip;
  form: FormGroup;
  isLoading = false;
  tripId: string;
private tripSub: Subscription;
  constructor(
    private route: ActivatedRoute,
private navCtrl: NavController,
    private tripService: TripService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController

  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('tripId')) {
        this.navCtrl.navigateBack('/trip/tabs/offers');
        return;
      }
      this.tripId = paramMap.get('placeId');
      this.isLoading = true;
      this.tripSub = this.tripService
        .getTrip(paramMap.get('tripId'))
        .subscribe(
          trip => {
            this.trip = trip;
            this.form = new FormGroup({
              title: new FormControl(this.trip.title, {
                updateOn: 'blur',
                validators: [Validators.required]
              }),
              description: new FormControl(this.trip.description, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.maxLength(180)]
              }),
              price: new FormControl(this.trip.price, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.min(1)]
              }),
              dateFrom: new FormControl(this.trip.availableFrom, {
                updateOn: 'blur',
                validators: [Validators.required]
              }),
              tel:new FormControl(this.trip.tel, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.min(1)]
              }),
              heure: new FormControl(this.trip.heure, {
                updateOn: 'blur',
                validators: [Validators.required]
              }),
               place:new FormControl(this.trip.nombreplace, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.min(1),Validators.max(3)]
              }),
              depart: new FormControl(this.trip.depart, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.maxLength(180)]
              }),
              arrivee: new FormControl(this.trip.arrivee, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.maxLength(180)]
              })
            });
            this.isLoading = false;
          },
          error => {
            this.alertCtrl
              .create({
                header: 'An error occurred!',
                message: 'Place could not be fetched. Please try again later.',
                buttons: [
                  {
                    text: 'Okay',
                    handler: () => {
                      this.router.navigate(['/trip/tabs/offers']);
                    }
                  }
                ]
              })
              .then(alertEl => {
                alertEl.present();
              });
          }
        );
    });
  }


  onUpdateOffer() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
    .create({
      message: 'Updating trip...'
    })
    .then(loadingEl => {
      loadingEl.present();
      this.tripService
        .updateTrip(
          this.trip.id,
          this.form.value.title,
          this.form.value.description
        )
        .subscribe(() => {
          loadingEl.dismiss();
          this.form.reset();
          this.router.navigate(['/trip/tabs/offers']);
        });
    });

  }
  ngOnDestroy() {
    if (this.tripSub) {
      this.tripSub.unsubscribe();
    }

  }

}
