import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule} from '@angular/forms';

import { DataService } from '../../../core/services/data.service';
import { goalApprovalRoutes} from './goalapproval.routes';
import { GoalApprovalComponent } from './goalapproval.component';
import { PaginationModule, ModalModule } from 'ngx-bootstrap';


@NgModule({
  imports: [
    CommonModule,
    PaginationModule.forRoot(),
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(goalApprovalRoutes)
  ],
  declarations: [GoalApprovalComponent],
  providers:[DataService]
})
export class GoalApprovalModule { }
