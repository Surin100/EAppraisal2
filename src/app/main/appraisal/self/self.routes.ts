import { Routes } from '@angular/router';
import {SelfComponent} from './self.component';

export const selfRoutes : Routes = [
    {path:'', redirectTo:'index', pathMatch:'full'},
    {path:'index',component:SelfComponent}
]