/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable guard-for-in */
/* eslint-disable prefer-const */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable max-len */
/* eslint-disable arrow-body-style */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, of, Subscription } from 'rxjs';
import { Trip } from './trip.model';
import { take, map, delay, tap, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFirestore } from 'angularfire2/firestore';
import { trimTrailingNulls } from '@angular/compiler/src/render3/view/util';
import * as firebase from 'firebase';

interface TripData {
  availableFrom: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
  tel: number;
  heure: Date;
  nombreplace: number;
  depart: string;
  arrivee: string;
  conduit: string;
}

@Injectable({
  providedIn: 'root'//bi star hedha najmou injectou TripService fi discover w ile yelzem nzidouh fi app module (providers)
})
export class TripService {
  private _trips= new BehaviorSubject<Trip[]>([
    // new Trip(
    //   'p1',
    //   'Manhattan Mansion',
    //   'In the heart of New York City.',
    //   'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
    //   149.99,new Date('2019-01-01'),
    //   'abc'
    // ),
    // new Trip(
    //   'p2',
    //   'L\'Amour Toujours',
    //   'A romantic place in Paris!',
    //   'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Paris_Night.jpg/1024px-Paris_Night.jpg',
    //   189.99,new Date('2019-01-01'),
    //   'abc'
    // ),
    // new Trip(
    //   'p3',
    //   'The Foggy Palace',
    //   'Not your average city trip!',
    //   'https://upload.wikimedia.org/wikipedia/commons/0/01/San_Francisco_with_two_bridges_and_the_fog.jpg',
    //   99.99,new Date('2019-01-01'),
    //   'abc'
    // )
  ]);
  private image: string;

  get trips() {
    // eslint-disable-next-line no-underscore-dangle
    return this._trips.asObservable();
  }

  constructor(private authService: AuthService,private http: HttpClient,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,) { }
  getTrip(id: string) {
    return this.http
      .get<TripData>(
        `https://testauth-8c814-default-rtdb.firebaseio.com/offered-places/${id}.json`
      )
      .pipe(
        // eslint-disable-next-line @typescript-eslint/naming-convention
        map(TripData => {
          return new Trip(
            id,
            TripData.title,
            TripData.description,
            TripData.imageUrl,
            TripData.price,
            new Date(TripData.availableFrom),
            TripData.userId,
            TripData.tel,
            TripData.heure,
            TripData.nombreplace,
            TripData.depart,
            TripData.arrivee,
            TripData.conduit
          );
        })
      );

  }
  fetchTrips() {
    let tr = [];
 /* this.firestore.collection('offered-places').
   snapshotChanges().subscribe(
      data => {
        data.map( resData => {
              const newTrip =
                new Trip(
                  resData.payload.doc.id,
                  resData.payload.doc.data()['title'],
                  resData.payload.doc.data()['description'],
                  resData.payload.doc.data()['imageUrl'],
                  resData.payload.doc.data()['price'],
                  new Date(resData.payload.doc.data()['dateFrom'].toDate()),
                  resData.payload.doc.data()['userId'],
                  resData.payload.doc.data()['tel'],
                  resData.payload.doc.data()['heure'],
                  resData.payload.doc.data()['nombreplace'],
                  resData.payload.doc.data()['depart'],
                  resData.payload.doc.data()['arrivee']
                );

                this.addData(newTrip);



          // return [];
        })

      }
    );*/
//return this._trips.asObservable();
    return this.http
      .get<{ [key: string]: TripData }>(
        'https://testauth-8c814-default-rtdb.firebaseio.com/offered-places.json'
      )
      .pipe(
        map(resData => {
          const trips = [];
          for (const key in resData) {
           /* let image: string;
            var storageRef = firebase.storage();
            var pathReference = storageRef.ref('/images/' + resData[key].imageUrl);
            pathReference.getDownloadURL().then(function(url) {
              // Insert url into an <img> tag to "download"
              this.image=url;
                console.log(url);
              });*/
          //console.log( 'nopppp'+ firebase.storage().ref().child('images/'+resData[key].imageUrl).getDownloadURL().then(url2 =>{console.log(url2)}))
         //this.storage.ref('gs://testauth-8c814.appspot.com/').child(resData[key].imageUrl).getDownloadURL().subscribe(data =>{this.image=data; console.log('hohoho'+ data)})
       //     console.log('image picked'+this.storage.ref(resData[key].imageUrl).getDownloadURL().toString);

            if (resData.hasOwnProperty(key)) {
              console.log('hhhhh'+resData[key].conduit)
              trips.push(
                new Trip(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].price,
                  new Date(resData[key].availableFrom),
                  resData[key].userId,
                  resData[key].tel,
                  resData[key].heure,
                  resData[key].nombreplace,
                  resData[key].depart,
                  resData[key].arrivee,
                  resData[key].conduit




                )
              )
              ;
            }
          }
          return trips;
          // return [];
        }),
        tap(trips => {
          this._trips.next(trips);
        })
      );
  }

  addTrip(
    title: string,
    description: string,
    price: number,
    image: string,
    dateFrom: Date,
    tel: number,
    heure: Date,
    nombreplace: number,
    depart: string,
    arrivee: string,
    conduit: string
  ) {

    let generatedId: string;

    const newTrip = new Trip(
      Math.random().toString(),
      title,
      description,
      image,
      price,
      dateFrom,
      this.authService.userId,
      tel,
      heure,
      nombreplace,
      depart,
      arrivee,
      conduit
    );
  /* this.firestore.collection('offered-places').add({
      title:newTrip.title,
      description:newTrip.description,
      imageUrl:image,
      price:newTrip.price,
      dateFrom:newTrip.availableFrom,
      userId:this.authService.userId,
      tel:newTrip.tel,
      heure:newTrip.heure,
      nombreplace:newTrip.nombreplace,
      depart:newTrip.depart,
      arrivee:newTrip.arrivee,

    }).then(docRef =>{
      console.log('document '+docRef.id);
      newTrip.id = docRef.id;
      this.addData(newTrip);
      console.log(this._trips.getValue);
   });*/
   //return this._trips ;
 console.log( this.http
      .post<{ name: string }>(
        'https://testauth-8c814-default-rtdb.firebaseio.com/offered-places.json',
        {
          ...newTrip,
          id: null
        }
      ));
    return this.http
      .post<{ name: string }>(
        'https://testauth-8c814-default-rtdb.firebaseio.com/offered-places.json',
        {
          ...newTrip,
          id: null
        }
      )
      .pipe(
        switchMap(resData => {
          console.log(resData);
          generatedId = resData.name;
          return this.trips;
        }),
        take(1),
        tap(places => {
          newTrip.id = generatedId;
          this._trips.next(places.concat(newTrip));
        })
      );

    // return this.trips.pipe(
    //   take(1),
    //   delay(1000),
    //   tap(places => {
    //     this._trips.next(places.concat(newTrip));
    //   })
    // );

    };
    addData(dataObj) {
      var i;
      let p=false;
      const currentValue = this._trips.value;
      for (i = 0; i < currentValue.length; i++) {
        if (currentValue[i].id === dataObj.id) {
          p=true;
        }
    }
    if (p === false){
      const updatedValue = [...currentValue, dataObj];
      this._trips.next(updatedValue);
    }
  }
   updateTrip(tripId: string, title: string, description: string) {
      let updatedPlaces: Trip[];
      return this.trips.pipe(
        take(1),
        switchMap(trips => {
          if (!trips || trips.length <= 0) {
            return this.fetchTrips();
          } else {
            return of(trips);
          }
        }),
        switchMap(trips => {
          const updatedPlaceIndex = trips.findIndex(pl => pl.id === tripId);
          updatedPlaces = [...trips];
          const oldPlace = updatedPlaces[updatedPlaceIndex];
          updatedPlaces[updatedPlaceIndex] = new Trip(
            oldPlace.id,
            title,
            description,
            oldPlace.imageUrl,
            oldPlace.price,
            oldPlace.availableFrom,
            oldPlace.userId,
            oldPlace.tel,
            oldPlace.heure,
            oldPlace.nombreplace,
            oldPlace.depart,
            oldPlace.arrivee,
            oldPlace.conduit,

          );
          return this.http.put(
            `https://testauth-8c814-default-rtdb.firebaseio.com/offered-places/${tripId}.json`,
            { ...updatedPlaces[updatedPlaceIndex], id: null }
          );
        }),
        tap(() => {
          this._trips.next(updatedPlaces);
        })
      );
    }
    cancelOffer(tripId: string) {
      return this.http
        .delete(
          `https://testauth-8c814-default-rtdb.firebaseio.com/offered-places/${tripId}.json`
        )
        .pipe(
          switchMap(() => {
            return this.trips;
          }),
          take(1),
          tap(trips => {
            // eslint-disable-next-line no-underscore-dangle
            this._trips.next(trips.filter(b => b.id !== tripId));
          })
        );
    }
}


