import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePaymentsComponent } from './home-payments/home-payments.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';

const routes: Routes = [
  { path: '', component: HomePaymentsComponent },
  { path: 'history', component: PaymentHistoryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsRoutingModule { }
