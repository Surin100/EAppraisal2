import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';

import { SystemConstants } from '../common/system.constants';
import { LoggedInUser } from '../domain/loggedin.user';
import { UrlConstants } from '../common/url.constants';

import 'rxjs/add/operator/map';

@Injectable()
export class AuthenService {

  constructor(private _http: Http, private _router: Router) { }

  login(username: string, password: string) {
    let body = "userName=" + encodeURIComponent(username) +
      "&password=" + encodeURIComponent(password) +
      "&grant_type=password";
    let headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    let options = new RequestOptions({ headers: headers });

    return this._http.post(SystemConstants.BASE_API + '/token', body, options).map((response: Response) => {
      let user: LoggedInUser = response.json();
      // console.log(JSON.stringify(user));
      if (user.access_token) {
        localStorage.removeItem(SystemConstants.CURRENT_USER);
        localStorage.setItem(SystemConstants.CURRENT_USER, JSON.stringify(user));
        this._router.navigate([UrlConstants.HOME]);
      }

    });
  }
  logout() {
    localStorage.removeItem(SystemConstants.CURRENT_USER);
    this._router.navigate([UrlConstants.LOGIN]);
  }

  isUserAuthenticated(): boolean {
    let user = localStorage.getItem(SystemConstants.CURRENT_USER);
    if (user) {
      return true;
    }
    else
      return false;
  }

  getLoggedInUser(): LoggedInUser {
    let user: LoggedInUser;
    if (this.isUserAuthenticated()) {
      var userData = JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER));
      // debugger;
      user = new LoggedInUser(userData.access_token, userData.userName, userData.email, userData.fullName, userData.lm1, userData.lm2,
        userData.job, userData.userType, userData.userTitle, userData.departmentId, userData.departmentEnName, userData.companyId, userData.companyName,
        userData.roles, userData.departmentList, userData.companyList, userData.categoryList);
    }
    else
      user = null;
    return user;
  }
}