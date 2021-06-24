/* eslint-disable arrow-body-style */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { delay, map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

import { Booking } from './booking.model';


interface BookingData {
  tripconduit: string;
  tel: number;
  firstName: string;
  guestNumber: number;
  lastName: string;
  placeId: string;
  placeImage: string;
  placeTitle: string;
  userId: string;

}
@Injectable({ providedIn: 'root' })

export class BookingService {
  private _bookings = new BehaviorSubject<Booking[]>([]);
  private _bookings2 = new BehaviorSubject<Booking[]>([]);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  book: Booking;

  constructor(private authService: AuthService,private http: HttpClient) {}
  get bookings() {
    // eslint-disable-next-line no-underscore-dangle
    return this._bookings.asObservable();
  }
  get bookings2() {
    // eslint-disable-next-line no-underscore-dangle
    return this._bookings2.asObservable();
  }
  addBooking(
    tripconduit: string,
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    tel: number,
  ) {
    let generatedId: string;
    const newBooking = new Booking(
      tripconduit,
      Math.random().toString(),
      placeId,
      this.authService.userId,
      placeTitle,
      placeImage,
      firstName,
      lastName,
      guestNumber,
      tel,
    );
    return this.http
      .post<{ name: string }>(
        'https://testauth-8c814-default-rtdb.firebaseio.com/bookings.json',
        { ...newBooking, id: null }
      )
      .pipe(
        switchMap(resData => {
          generatedId = resData.name;
          return this.bookings;
        }),
        take(1),
        tap(bookings => {
          newBooking.id = generatedId;
          // eslint-disable-next-line no-underscore-dangle
          this._bookings.next(bookings.concat(newBooking));
        })
      );
  }


  cancelBooking(bookingId: string) {
    return this.http
      .delete(
        `https://testauth-8c814-default-rtdb.firebaseio.com/bookings/${bookingId}.json`
      )
      .pipe(
        switchMap(() => {
          return this.bookings;
        }),
        take(1),
        tap(bookings => {
          // eslint-disable-next-line no-underscore-dangle
          this._bookings.next(bookings.filter(b => b.id !== bookingId));
        })
      );
  }

  fetchBookings() {
    return this.http
      .get<{ [key: string]: BookingData }>(
        `https://testauth-8c814-default-rtdb.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${
          this.authService.userId
        }"`
      )
      .pipe(
        map(bookingData => {
          const bookings = [];
          for (const key in bookingData) {
            if (bookingData.hasOwnProperty(key)   ) {
              bookings.push(
                new Booking(
                  bookingData[key].tripconduit,
                  key,
                  bookingData[key].placeId,
                  bookingData[key].userId,
                  bookingData[key].placeTitle,
                  bookingData[key].placeImage,
                  bookingData[key].firstName,
                  bookingData[key].lastName,
                  bookingData[key].guestNumber,
                  bookingData[key].tel
                )
              );
            }
          }
          return bookings;
        }),
        tap(bookings => {
          // eslint-disable-next-line no-underscore-dangle
          this._bookings.next(bookings);
        })
      );
  }
  fetchBookingsd() {
    return this.http
      .get<{ [key: string]: BookingData }>(
        `https://testauth-8c814-default-rtdb.firebaseio.com/bookings.json?orderBy="tripconduit"&equalTo="${
          this.authService.userId
        }"`
      )
      .pipe(
        map(bookingData => {
          const bookings = [];
          for (const key in bookingData) {
            if (bookingData.hasOwnProperty(key)   ) {
              bookings.push(
                new Booking(
                  bookingData[key].tripconduit,
                  key,
                  bookingData[key].placeId,
                  bookingData[key].userId,
                  bookingData[key].placeTitle,
                  bookingData[key].placeImage,
                  bookingData[key].firstName,
                  bookingData[key].lastName,
                  bookingData[key].guestNumber,
                  bookingData[key].tel
                )
              );
            }
          }
          return bookings;
        }),
        tap(bookings => {
          // eslint-disable-next-line no-underscore-dangle
          this._bookings2.next(bookings);
        })
      );
  }


}
