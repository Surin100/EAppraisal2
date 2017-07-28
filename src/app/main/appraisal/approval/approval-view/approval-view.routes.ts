import { Routes } from '@angular/router';
import { ApprovalViewComponent } from './approval-view.component';

export const approvalViewRoutes: Routes = [
    { path: '', component: ApprovalViewComponent, pathMatch: 'full' }
]