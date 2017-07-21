import { Routes } from '@angular/router';
import { ApprovalComponent } from './approval.component';

export const approvalRoutes: Routes = [
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'index', loadChildren: './approval-index/approval-index.module#ApprovalIndexModule' }
]