import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelComponent } from './panel/panel.component';

const routes: Routes = [
  {
    path: '',
    component: PanelComponent,
    children: [
      {
        path: 'accounts',
        loadChildren: () => import('./modules/accounts/accounts.module').then(m => m.AccountsModule)
      },
      {
        path: 'payments',
        loadChildren: () => import('./modules/payments/payments.module').then(m => m.PaymentsModule)
      },
      {
        path: '**',
        redirectTo: 'accounts'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NeosecRoutingModule { }
