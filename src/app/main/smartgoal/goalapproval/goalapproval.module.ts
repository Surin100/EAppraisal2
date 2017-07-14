import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { goalApprovalRoutes} from './goalapproval.routes';
import { GoalApprovalComponent } from './goalapproval.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(goalApprovalRoutes)
  ],
  declarations: [GoalApprovalComponent]
})
export class GoalApprovalModule { }
