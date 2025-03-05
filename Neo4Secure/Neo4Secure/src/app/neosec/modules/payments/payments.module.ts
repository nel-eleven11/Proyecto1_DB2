import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentsRoutingModule } from './payments-routing.module';
import { HomePaymentsComponent } from './home-payments/home-payments.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersRoutingModule } from '../../../admin/modules/users/users-routing.module';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';



@NgModule({
  declarations: [
    HomePaymentsComponent,
    PaymentHistoryComponent
  ],
  imports: [
    CommonModule,
    PaymentsRoutingModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    FormsModule
  ]
})
export class PaymentsModule { }
