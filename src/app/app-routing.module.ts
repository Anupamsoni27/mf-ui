import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/funds',
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
    redirectTo: '/funds'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
