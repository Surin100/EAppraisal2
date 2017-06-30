import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ApprovalComponent } from './approval.component';
import { approvalRoutes } from './approval.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(approvalRoutes)
  ],
  declarations: [ApprovalComponent]
})
export class ApprovalModule { }
