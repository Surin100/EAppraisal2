import { Injectable, Compiler } from '@angular/core';
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
  constructor(private _http: Http, private _router: Router, private _handleErrorService: HandleErrorService,
    private _compiler: Compiler) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }

  login(username: string, password: string):any {
    let body = "userName=" + encodeURIComponent(username) +
      "&password=" + encodeURIComponent(password) + "&grant_type=password";
    let headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    let options = new RequestOptions({ headers: headers });

    return this._http.post(SystemConstants.BASE_API + '/token', body, options).map((response: Response) => {
      // console.log(user);
      let user = response.json();
      if (user.access_token) {
        // localStorage.removeItem(SystemConstants.CURRENT_USER);
        // localStorage.setItem(SystemConstants.CURRENT_USER, JSON.stringify(user));
        sessionStorage.removeItem(SystemConstants.CURRENT_USER);
        sessionStorage.setItem(SystemConstants.CURRENT_USER, JSON.stringify(user));
      }
      return user;
    });
  }

  logout() {
    this.headers.delete("Authorization");
    this.headers.append("Authorization", "Bearer " + this.getLoggedInUser().access_token);
    this._http.post(SystemConstants.BASE_API + '/api/Account/Logout', null, { headers: this.headers }).map((res: Response) => res.text() ? res.json() : {})
      .subscribe((response: Response) => {
        // window.localStorage.removeItem(SystemConstants.CURRENT_USER);
        sessionStorage.removeItem(SystemConstants.CURRENT_USER);
        this._router.navigate([UrlConstants.LOGIN]);
        // this._compiler.clearCache();
        // window.location.reload(true);
      }, error =>{
        // console.log(error);
      this._handleErrorService.handleError(error);
    });
  }

  isUserAuthenticated(): boolean {
    // let user = localStorage.getItem(SystemConstants.CURRENT_USER);
    let user = sessionStorage.getItem(SystemConstants.CURRENT_USER);
    if (user) {
      return true;
    }
    else
      return false;
  }

  getLoggedInUser(): LoggedInUser {
    let user: LoggedInUser;
    if (this.isUserAuthenticated()) {
      // var userData = JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER));
      var userData = JSON.parse(sessionStorage.getItem(SystemConstants.CURRENT_USER));
      // debugger;
      // console.log(userData);
      user = new LoggedInUser(userData.access_token, userData.userName, userData.email, userData.fullName, userData.employeeLvId, userData.jobTitle,
        userData.departmentId, userData.departmentEnName, userData.companyId, userData.companyName, userData.reviewerName, userData.reviewerTitle,
        userData.roles, userData.departmentList, userData.companyList, userData.categoryList, userData.statusList, userData.companyHRList);
        // userData.goal1Content, userData.goal2Content, userData.goal3Content, userData.goal4Content);
    }
    else
      user = null;
    return user;
  }
}