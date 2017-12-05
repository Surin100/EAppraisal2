import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { SystemConstants } from '../common/system.constants';
import { UrlConstants } from '../common/url.constants';

@Injectable()
export class AuthenGuard implements CanActivate {

  constructor(private _router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // if (localStorage.getItem(SystemConstants.CURRENT_USER)) {
    if (sessionStorage.getItem(SystemConstants.CURRENT_USER)) {
      return true;
    }
    else {
      this._router.navigate([UrlConstants.LOGIN]);
      return false;
    }
  }
}
