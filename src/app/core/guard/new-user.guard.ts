import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';


import { SystemConstants } from '../common/system.constants';
import { LoggedInUser } from '../domain/loggedin.user';
import { UrlConstants } from '../common/url.constants';
// import { DataService } from '../services/data.service';

@Injectable()
export class NewUserGuard implements CanActivate {
  private headers: Headers;

  constructor(private _router: Router, private _http: Http) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // let currentUser: LoggedInUser = JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER));
    let currentUser: LoggedInUser = JSON.parse(sessionStorage.getItem(SystemConstants.CURRENT_USER));
    if (!currentUser) {
      this._router.navigate([UrlConstants.LOGIN]);
      return false;
    }

    let today = new Date();
    let expireDate = new Date(currentUser['.expires']);

    // console.log(expireDate > today);
    if (expireDate < today) {
      // localStorage.removeItem(SystemConstants.CURRENT_USER);
      sessionStorage.removeItem(SystemConstants.CURRENT_USER);
      this._router.navigate([UrlConstants.LOGIN]);
      return false;
    }

    // if (currentUser.roles.includes('NewUser')) {
    //   this._router.navigate([UrlConstants.CHANGE_PASSWORD]);
    //   return false;
    // }

    this.headers.delete("Authorization");
    this.headers.append("Authorization", "Bearer " + currentUser.access_token);
    this._http.get(SystemConstants.BASE_API + '/api/Account/GetRole', { headers: this.headers })
      .map(this.extractData)
      .subscribe((data)=> {
        // console.log(currentUser);
        if(data.includes('NewUser') && currentUser.roles.includes('NewUser')){ 
          this._router.navigate([UrlConstants.CHANGE_PASSWORD]);
          return false;
        }
        if(!data.includes('NewUser') && currentUser.roles.includes('NewUser')){
          this._router.navigate([UrlConstants.LOGIN]);
          // localStorage.removeItem(SystemConstants.CURRENT_USER);
          sessionStorage.removeItem(SystemConstants.CURRENT_USER);
        }
      });

    // this._http.get('/api/AccountController/GetRole').map().subscribe((data)=> {
    //   console.log(data);
    //   if(data.includes('NewUser')){ 
    //     this._router.navigate([UrlConstants.CHANGE_PASSWORD]);
    //     return false;
    //   }
    // });
    return true;
  }

  private extractData(res: Response) {
    return res.text() ? res.json() : {};;
  }
}
