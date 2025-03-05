import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { AlertComponent } from './alert/alert.component';
import { LoaderComponent } from './loader/loader.component';
import { NavbarUserComponent } from './navbar-user/navbar-user.component';



@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    AlertComponent,
    LoaderComponent,
    NavbarUserComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    NavbarComponent,
    FooterComponent,
    AlertComponent,
    LoaderComponent,
    NavbarUserComponent
  ]
})
export class SharedModule { }
