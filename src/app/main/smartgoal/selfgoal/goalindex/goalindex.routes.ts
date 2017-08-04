import { Routes } from '@angular/router';

import { GoalIndexComponent } from './goalindex.component';

export const goalIndexRoutes: Routes = [
    { path: '', component: GoalIndexComponent, pathMatch: 'full' }
]