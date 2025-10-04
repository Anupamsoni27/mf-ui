import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { StockListComponent } from './stock-list/stock-list.component';
import { StockDetailComponent } from './stock-detail/stock-detail.component';
import { StockTimelineComponent } from './stock-timeline/stock-timeline.component';
import {HighchartsChartModule} from "highcharts-angular";

const routes = [
  {
    path: '',
    component: StockListComponent
  },
  {
    path: ':stockId',
    component: StockDetailComponent
  }
];

@NgModule({
  declarations: [
    StockListComponent,
    StockDetailComponent,
    StockTimelineComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    HighchartsChartModule
  ]
})
export class StocksModule { }
