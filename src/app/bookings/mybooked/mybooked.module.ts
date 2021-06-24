import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MybookedPageRoutingModule } from './mybooked-routing.module';

import { MybookedPage } from './mybooked.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MybookedPageRoutingModule
  ],
  declarations: [MybookedPage]
})
export class MybookedPageModule {}
