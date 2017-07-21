import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'

import { PaginationModule } from 'ngx-bootstrap';

import { approvalIndexRoutes } from './approval-index.routes';
import { ApprovalIndexComponent } from './approval-index.component';
import { DataService } from '../../../../core/services/data.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule.forRoot(),
    RouterModule.forChild(approvalIndexRoutes)
  ],
  providers: [DataService],
  declarations: [ApprovalIndexComponent]
})

export class ApprovalIndexModule { }
