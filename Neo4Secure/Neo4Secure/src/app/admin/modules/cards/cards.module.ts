import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardsRoutingModule } from './cards-routing.module';
import { HomeCardsComponent } from './home-cards/home-cards.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersRoutingModule } from '../users/users-routing.module';
import { CardModalComponent } from './card-modal/card-modal.component';


@NgModule({
  declarations: [
    HomeCardsComponent,
    CardModalComponent
  ],
  imports: [
    CommonModule,
    CardsRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    FormsModule
  ]
})
export class CardsModule { }
