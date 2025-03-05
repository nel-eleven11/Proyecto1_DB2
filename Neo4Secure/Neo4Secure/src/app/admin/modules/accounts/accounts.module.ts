import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './accounts-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersRoutingModule } from '../users/users-routing.module';
import { HomeAccountsComponent } from './home-accounts/home-accounts.component';
import { AccountModalComponent } from './account-modal/account-modal.component';


@NgModule({
  declarations: [
    HomeAccountsComponent,
    AccountModalComponent
  ],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    FormsModule
  ]
})
export class AccountsModule { }
