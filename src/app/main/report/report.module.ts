import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MyDatePickerModule } from 'mydatepicker';

import { DataService } from '../../core/services/data.service';
import { ReportComponent } from './report.component';
import { reportRoutes } from './report.routes';
import { SummaryPerformanceAppraisalComponent } from './summary-performance-appraisal/summary-performance-appraisal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MyDatePickerModule,
    RouterModule.forChild(reportRoutes)
  ],
  providers: [DataService],
  declarations: [ReportComponent, SummaryPerformanceAppraisalComponent]
})
export class ReportModule { }
