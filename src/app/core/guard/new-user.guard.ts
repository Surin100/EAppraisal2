import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import {SystemConstants} from '../common/system.constants';
import { LoggedInUser } from '../domain/loggedin.user';
import {UrlConstants} from '../common/url.constants';

@Injectable()
export class NewUserGuard implements CanActivate {

  constructor(private _router:Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      let currentUser:LoggedInUser = JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER));
      if(!currentUser){
        this._router.navigate([UrlConstants.LOGIN]);
        return false;
      }

      let today = new Date();
      let expireDate = new Date(currentUser['.expires']);

      // console.log(expireDate > today);
      if(expireDate < today ){
        localStorage.removeItem(SystemConstants.CURRENT_USER);
        this._router.navigate([UrlConstants.LOGIN]);
        return false;
      }

      if(currentUser.roles.includes('NewUser')){ 
        this._router.navigate([UrlConstants.CHANGE_PASSWORD]);
        return false;
      }
    return true;
  }
}
