import { Routes } from '@angular/router';

import { AuthenGuard } from './core/guard/authen.guard';
import { NewUserGuard } from './core/guard/new-user.guard';
import { NonAuthenGuard } from './core/guard/non-authen.guard';

export const appRoutes: Routes = [
    { path: '', redirectTo: 'main', pathMatch: 'full' },
    { path: 'main', loadChildren: './main/main.module#MainModule', canActivate: [NewUserGuard] },
    { path: 'login', loadChildren: './login/login.module#LoginModule', canActivate: [NonAuthenGuard] },
    { path: 'ChangePassword', loadChildren: './change-password/change-password.module#ChangePasswordModule', canActivate: [AuthenGuard] }
]