import { Component, Input, OnInit } from '@angular/core';
import { Trip } from '../../trip.model';

@Component({
  selector: 'app-offer-item',
  templateUrl: './offer-item.component.html',
  styleUrls: ['./offer-item.component.scss'],
})
export class OfferItemComponent implements OnInit {
  @Input() offer: Trip;
  constructor() { }

  ngOnInit() {}

}
