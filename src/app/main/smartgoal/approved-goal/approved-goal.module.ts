import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MyDatePickerModule } from 'mydatepicker';
import { PaginationModule, ModalModule } from 'ngx-bootstrap';

import { ApprovedGoalComponent } from './approved-goal.component';
import { approvedGoalRoutes } from './approved-goal.routes';
import { DataService } from '../../../core/services/data.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MyDatePickerModule,
    RouterModule.forChild(approvedGoalRoutes),
    PaginationModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [ApprovedGoalComponent],
  providers: [DataService]
})
export class ApprovedGoalModule { }
