import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransactionRoutingModule } from './transaction-routing.module';
import { HomeTransactionComponent } from './home-transaction/home-transaction.component';



@NgModule({
  declarations: [
    HomeTransactionComponent
  ],
  imports: [
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
  TransactionRoutingModule
  ]
})
export class TransactionModule { }
