import { Routes } from '@angular/router';
import { ApprovedGoalComponent } from './approved-goal.component';

export const approvedGoalRoutes: Routes = [
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'index', component: ApprovedGoalComponent }
]