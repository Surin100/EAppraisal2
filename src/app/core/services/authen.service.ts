import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';

import { SystemConstants } from '../common/system.constants';
import { LoggedInUser } from '../domain/loggedin.user';
import { UrlConstants } from '../common/url.constants';
import { HandleErrorService } from './handle-error.service';

import 'rxjs/add/operator/map';

@Injectable()
export class AuthenService {
  private headers: Headers;
  constructor(private _http: Http, private _router: Router, private _handleErrorService: HandleErrorService) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }

  login(username: string, password: string) {
    let body = "userName=" + encodeURIComponent(username) +
      "&password=" + encodeURIComponent(password) + "&grant_type=password";
    let headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    let options = new RequestOptions({ headers: headers });
    return this._http.post(SystemConstants.BASE_API + '/token', body, options).map((response: Response) => {
      let user: LoggedInUser = response.json();
      // console.log(user);
      if (user.access_token) {
        localStorage.removeItem(SystemConstants.CURRENT_USER);
        localStorage.setItem(SystemConstants.CURRENT_USER, JSON.stringify(user));
        this._router.navigate([UrlConstants.HOME]);
      }

    });
  }

  logout() {
    this.headers.delete("Authorization");
    this.headers.append("Authorization", "Bearer " + this.getLoggedInUser().access_token);
    this._http.post(SystemConstants.BASE_API + '/api/Account/Logout', null, { headers: this.headers }).map((res: Response) => res.text() ? res.json() : {})
      .subscribe((response: Response) => {
        localStorage.removeItem(SystemConstants.CURRENT_USER);
        this._router.navigate([UrlConstants.LOGIN]);
      }, error => this._handleErrorService.handleError(error));
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
      user = new LoggedInUser(userData.access_token, userData.userName, userData.email, userData.fullName,
        userData.employeeLvId, userData.jobTitle, userData.departmentId, userData.departmentEnName, userData.companyId, userData.companyName,
        userData.roles, userData.departmentList, userData.companyList, userData.categoryList, userData.statusList);
    }
    else
      user = null;
    return user;
  }
}