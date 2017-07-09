import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';

import { AppraisalComponent } from './appraisal.component';
import {appraisalRoutes}from './appraisal.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(appraisalRoutes)
  ],
  declarations: [AppraisalComponent]
})

export class AppraisalModule { }
