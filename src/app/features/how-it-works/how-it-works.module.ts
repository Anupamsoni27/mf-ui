import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HowItWorksComponent } from './how-it-works.component';

const routes: Routes = [
    { path: '', component: HowItWorksComponent }
];

@NgModule({
    declarations: [HowItWorksComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class HowItWorksModule { }
