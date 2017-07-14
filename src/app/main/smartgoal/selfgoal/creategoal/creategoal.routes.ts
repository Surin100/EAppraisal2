import { Routes } from '@angular/router';

import { CreateGoalComponent } from './creategoal.component';

export const createGoalRoutes: Routes = [
    { path: '', component: CreateGoalComponent, pathMatch: 'full' }
]