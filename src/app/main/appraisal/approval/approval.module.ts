import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MyDatePickerModule } from 'mydatepicker';
import { PaginationModule, ModalModule } from 'ngx-bootstrap';

import { ApprovalComponent } from './approval.component';
import { DataService } from '../../../core/services/data.service';
import { approvalRoutes } from './approval.routes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MyDatePickerModule,
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    RouterModule.forChild(approvalRoutes)
  ],
  providers: [DataService],
  declarations: [ApprovalComponent]
})
export class ApprovalModule { }
