import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AgChartsAngularModule } from 'ag-charts-angular';

import { SharedModule } from '../../shared/shared.module';
import { FundListComponent } from './fund-list/fund-list.component';
import { FundDetailComponent } from './fund-detail/fund-detail.component';
import { FundTimelineChartComponent } from './fund-timeline-chart.component';

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
    FundDetailComponent,
    FundTimelineChartComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AgChartsAngularModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class FundsModule { }
