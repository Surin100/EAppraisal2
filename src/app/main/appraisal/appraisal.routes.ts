import { Routes } from '@angular/router';

import { AppraisalComponent } from './appraisal.component';

export const appraisalRoutes: Routes = [

    {
        path: '', component: AppraisalComponent, children: [
            { path: '', redirectTo: 'self', pathMatch: 'full' },
            { path: 'self', loadChildren: './self/self.module#SelfModule' },
            { path: 'approval', loadChildren: './approval/approval.module#ApprovalModule' }
        ]
    }
]
