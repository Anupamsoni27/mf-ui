import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/how-it-works/how-it-works.module').then(m => m.HowItWorksModule),
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
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
    path: 'profile',
    loadChildren: () => import('./features/user-profile/user-profile.module').then(m => m.UserProfileModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'how-it-works',
    loadChildren: () => import('./features/how-it-works/how-it-works.module').then(m => m.HowItWorksModule)
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
