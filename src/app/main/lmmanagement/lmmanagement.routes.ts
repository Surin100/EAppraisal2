import { Routes } from '@angular/router';
import { LMManagementComponent } from './lmmanagement.component';

export const lmmanagementRoutes: Routes = [
    { path: '', component: LMManagementComponent, pathMatch: 'full' }
]