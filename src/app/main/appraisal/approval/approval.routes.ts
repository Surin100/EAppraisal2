import { Routes } from '@angular/router';
import { ApprovalComponent } from './approval.component';

export const approvalRoutes: Routes = [
    {
        path: '', children: [
            { path:'', component: ApprovalComponent, pathMatch:'full' },
            { path: 'ApprovalView', loadChildren: './approval-view/approval-view.module#ApprovalViewModule' }
        ]
    }
]