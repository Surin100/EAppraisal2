import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MyDatePickerModule } from 'mydatepicker';
import { PaginationModule, ModalModule } from 'ngx-bootstrap';

import { ApprovalComponent } from './approval.component';
import { DataService } from '../../../core/services/data.service';
import {SignalrService} from '../../../core/services/signalr.service';
import { approvalRoutes } from './approval.routes';
import {AutosizeModule } from '../../autosize/autosize.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MyDatePickerModule,
    AutosizeModule,
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    RouterModule.forChild(approvalRoutes)
  ],
  providers: [DataService, SignalrService],
  declarations: [ApprovalComponent]
})
export class ApprovalModule { }
