import { Routes } from '@angular/router';
import { GoalApprovalComponent } from './goalapproval.component';

export const goalApprovalRoutes: Routes = [
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'index', component: GoalApprovalComponent }
]