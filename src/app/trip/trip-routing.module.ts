import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { TripPage } from './trip.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TripPage,
    children: [
      {
        path: 'discover',
        children: [
          {
            path: '',
            loadChildren: () => import('./discover/discover.module').then(m => m.DiscoverPageModule),
            canLoad: [AuthGuard]
          },
          {
            path: ':tripId',
            loadChildren: () => import('./discover/trip-detail/trip-detail.module').then(m => m.TripDetailPageModule)
          }
        ]
      },
      {
        path: 'offers',
        children: [
          {
            path: '',
            loadChildren: () => import('./offers/offers.module').then(m => m.OffersPageModule)
          },
          {
            path: 'new',
            loadChildren: () => import('./offers/new-offer/new-offer.module').then(m => m.NewOfferPageModule)
          },
          {
            path: 'edit/:tripId',
            loadChildren: () => import('./offers/edit-offer/edit-offer.module').then(m => m.EditOfferPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/trip/tabs/discover',
        canLoad: [AuthGuard],
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/trip/tabs/discover',
        canLoad: [AuthGuard],
    pathMatch: 'full'
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TripPageRoutingModule {}
