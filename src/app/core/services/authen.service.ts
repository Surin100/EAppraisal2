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
      // let goal1Plan: string = '';
      // let goal2Plan: string = '';
      // let goal3Plan: string = '';
      // let goal4Plan: string = '';

      // let goal1Content = JSON.parse(user.goal1Content);
      // let goal2Content = JSON.parse(user.goal2Content);
      // let goal3Content = JSON.parse(user.goal3Content);
      // let goal4Content = JSON.parse(user.goal4Content);

      // goal1Content.forEach(element => {
      //   goal1Plan += element.plan + '\n';

      // });
      // goal2Content.forEach(element => {
      //   goal2Plan += element.plan + '\n';
      // });
      // goal3Content.forEach(element => {
      //   goal3Plan += element.plan + '\n';
      // });
      // goal4Content.forEach(element => {
      //   goal4Plan += element.plan + '\n';
      // });

      // user.goal1Content = goal1Plan;
      // user.goal2Content = goal2Plan;
      // user.goal3Content = goal3Plan;
      // user.goal4Content = goal4Plan;
      // console.log(user.goal1Content);
      // console.log(user.goal2Content);
      // console.log(user.goal3Content);
      // console.log(user.goal4Content);

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
        window.localStorage.removeItem(SystemConstants.CURRENT_USER);
        this._router.navigate([UrlConstants.LOGIN]);
      }, error =>{
        // console.log(error);
      this._handleErrorService.handleError(error);
    });
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