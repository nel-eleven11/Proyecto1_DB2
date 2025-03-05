import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePaymentsComponent } from './home-payments/home-payments.component';

const routes: Routes = [
  { path: '', component: HomePaymentsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsRoutingModule { }
