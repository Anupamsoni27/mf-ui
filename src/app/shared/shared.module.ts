import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';

import { ButtonComponent } from './components/button/button.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ModalComponent } from './components/modal/modal.component';
import { SparklineComponent } from './components/sparkline/sparkline.component';

@NgModule({
  declarations: [
    ButtonComponent,
    LoadingSpinnerComponent,
    ModalComponent,
    SparklineComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HighchartsChartModule
  ],
  exports: [
    ButtonComponent,
    LoadingSpinnerComponent,
    ModalComponent,
    SparklineComponent,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
