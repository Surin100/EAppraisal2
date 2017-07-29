import { Routes } from '@angular/router';
import { ApprovedComponent } from './approved.component';

export const approvedRoutes: Routes = [
    {
        path: '', children: [
            { path:'', component: ApprovedComponent, pathMatch:'full' }
        ]
    }
]