import { Routes } from '@angular/router';
import {ApprovalComponent} from './approval.component';

export const approvalRoutes : Routes = [
    {path:'', component:ApprovalComponent, pathMatch:'full'}
]