import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HighchartsChartModule } from 'highcharts-angular';

import { ButtonComponent } from './components/button/button.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ModalComponent } from './components/modal/modal.component';
import { SparklineComponent } from './components/sparkline/sparkline.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NotificationComponent } from './components/notification/notification.component';

@NgModule({
  declarations: [
    ButtonComponent,
    LoadingSpinnerComponent,
    ModalComponent,
    SparklineComponent,
    SidebarComponent,
    NotificationComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HighchartsChartModule,
    RouterModule
  ],
  exports: [
    ButtonComponent,
    LoadingSpinnerComponent,
    ModalComponent,
    SparklineComponent,
    SidebarComponent,
    NotificationComponent,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
