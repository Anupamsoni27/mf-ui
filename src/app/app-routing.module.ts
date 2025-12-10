import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/stocks',
    pathMatch: 'full'
  },
  {
    path: 'funds',
    loadChildren: () => import('./features/funds/funds.module').then(m => m.FundsModule)
  },
  {
    path: 'stocks',
    loadChildren: () => import('./features/stocks/stocks.module').then(m => m.StocksModule)
  },
  {
    path: '**',
    redirectTo: '/stocks'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
