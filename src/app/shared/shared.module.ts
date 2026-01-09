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
import { FavoriteButtonComponent } from './components/favorite-button/favorite-button.component';

import { InfoIconComponent } from './components/info-icon/info-icon.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';

@NgModule({
  declarations: [
    ButtonComponent,
    LoadingSpinnerComponent,
    ModalComponent,
    SparklineComponent,
    SidebarComponent,
    NotificationComponent,
    FavoriteButtonComponent,
    InfoIconComponent,
    TooltipComponent
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
    FavoriteButtonComponent,
    InfoIconComponent,
    TooltipComponent,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
