import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NeosecRoutingModule } from './neosec-routing.module';
import { PanelComponent } from './panel/panel.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    PanelComponent
  ],
  imports: [
    CommonModule,
    NeosecRoutingModule,
    SharedModule,
    TranslateModule
  ]
})
export class NeosecModule { }
