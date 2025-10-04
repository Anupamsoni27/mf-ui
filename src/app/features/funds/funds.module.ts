import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { FundListComponent } from './fund-list/fund-list.component';
import { FundDetailComponent } from './fund-detail/fund-detail.component';

const routes = [
  {
    path: '',
    component: FundListComponent
  },
  {
    path: ':fundId',
    component: FundDetailComponent
  }
];

@NgModule({
  declarations: [
    FundListComponent,
    FundDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class FundsModule { }
