/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { AuthService } from 'src/app/auth/auth.service';
import { TripService } from '../../trip.service';

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  form: FormGroup;
  constructor(private tripService: TripService,private authService: AuthService,
    private storage: AngularFireStorage,
    private fire: AngularFirestore,
    private router: Router,private loadingCtrl: LoadingController) { }
    task: AngularFireUploadTask;
    downloadableURL: string;

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      image: new FormControl(null),
      tel:new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      heure: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
       place:new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1),Validators.max(3)]
      }),
      depart: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      arrivee: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
    });
  }

  onCreateOffer() {
  if (!this.form.valid) {
    return;
  }
  console.log('image :'+this.form.value.image);
  this.loadingCtrl
    .create({
      message: 'Creating place...'
    })
    .then(loadingEl => {
      loadingEl.present();
      this.tripService
        .addTrip(
          this.form.value.title,
          this.form.value.description,
          this.form.value.price,
          this.form.value.image,
          new Date(this.form.value.dateFrom),
          this.form.value.tel,
          this.form.value.heure,
          this.form.value.place,
          this.form.value.depart,
          this.form.value.arrivee,
          this.authService.userId
        ).subscribe(() => {
          loadingEl.dismiss();
          this.form.reset();
          this.router.navigate(['/trip/tabs/offers']);
        });
    });
}
  async onImagePicked(imageData: string | File) {
  let imageFile;

  if (typeof imageData === 'string') {
    try {
      imageFile = base64toBlob(
       imageData.replace('data:image/jpeg;base64,', ''),
        'image/jpeg'
      );
      console.log('image get by phone'+imageData);
    this.task=  this.storage.upload(`images/${Date.now()}_${imageData.substr(28,6)}.jpeg`,imageFile);
      (await this.task).ref.getDownloadURL().then(url => {this.downloadableURL = url;
        console.log(url);
        this.form.value.image=url;
       });




    } catch (error) {
      console.log(error);
      return;
    }
  } else {
    imageFile = imageData;
    this.storage.upload('llll',imageFile);
  }
  console.log(imageFile);
  //this.form.patchValue({ image: imageFile });


}

}

