import { Routes } from '@angular/router';
import { SelfComponent } from './self.component';

export const selfRoutes: Routes = [
    {
        path: '', component: SelfComponent, children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', loadChildren: './index/index.module#IndexModule' },
            { path: 'create', loadChildren: './create/create.module#CreateModule' }
        ]
    },

]