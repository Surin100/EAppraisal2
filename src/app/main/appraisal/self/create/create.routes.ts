import { Routes } from '@angular/router';

import {CreateComponent} from './create.component';

export const createRoutes : Routes = [
    {path:'',component:CreateComponent,pathMatch:'full'}
]