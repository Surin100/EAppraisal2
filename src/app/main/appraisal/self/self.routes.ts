import { Routes } from '@angular/router';
import {SelfComponent} from './self.component';

export const selfRoutes : Routes = [
    {path:'', component:SelfComponent, pathMatch:'full'}
]