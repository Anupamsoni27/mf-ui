import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ButtonComponent } from './components/button/button.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
  declarations: [
    ButtonComponent,
    LoadingSpinnerComponent,
    ModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    ButtonComponent,
    LoadingSpinnerComponent,
    ModalComponent,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
