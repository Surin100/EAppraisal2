import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule} from '@angular/router';

import { ApprovalViewComponent } from './approval-view.component';
import { DataService } from '../../../../core/services/data.service';
import { approvalViewRoutes} from './approval-view.routes';
import { ApprovalComponent} from '../approval.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(approvalViewRoutes)
  ],
  providers: [DataService,ApprovalComponent],
  declarations: [ApprovalViewComponent]
})
export class ApprovalViewModule { }
