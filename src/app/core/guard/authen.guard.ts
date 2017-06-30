import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import {SystemConstants} from '../common/system.constants';
import {UrlConstants} from '../common/url.constants';

@Injectable()
export class AuthenGuard implements CanActivate {

    constructor(private _router: Router) { }

    canActivate(activeRoute: ActivatedRouteSnapshot, routerState: RouterStateSnapshot) {
        if(localStorage.getItem(SystemConstants.CURRENT_USER)){
            return true;
        }
        else{
            this._router.navigate([UrlConstants.LOGIN]);
            return false;
        }
    }
}