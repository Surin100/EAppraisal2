import { Routes } from '@angular/router';

import { SmartGoalComponent } from './smartgoal.component';

export const smartGoalRoutes: Routes = [
    {
        path: '', component: SmartGoalComponent, children: [
            { path: '', redirectTo: 'selfgoal', pathMatch: 'full' },
            { path: 'selfgoal', loadChildren: './selfgoal/selfgoal.module#SelfGoalModule' },
            { path: 'goalapproval', loadChildren: './goalapproval/goalapproval.module#GoalApprovalModule' }
        ]
    }
]