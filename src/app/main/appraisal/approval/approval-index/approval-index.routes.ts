import { Routes } from '@angular/router';

import {ApprovalIndexComponent} from './approval-index.component';

export const approvalIndexRoutes : Routes = [
    {path:'',component:ApprovalIndexComponent,pathMatch:'full'}
]