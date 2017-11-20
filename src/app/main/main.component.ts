import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { Compiler} from '@angular/compiler';

import { AuthenService } from '../core/services/authen.service';
import { LoggedInUser } from '../core/domain/loggedin.user';
import { SystemConstants } from '../core/common/system.constants';
import { UrlConstants } from '../core/common/url.constants';
import {SignalrService} from '../core/services/signalr.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  user: LoggedInUser;
  selfLoad: Boolean;
  selfGoalLoad: Boolean;
  constructor(private _authenService: AuthenService, private _router: Router, 
    private _signalrService: SignalrService) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER));
    // console.log(JSON.stringify(this.user));
    // console.log(this.user);
  }
  logout() {
    this._authenService.logout();
  }

  homeClick() {
    this._router.navigate([UrlConstants.HOME]);
  }

  appraisalClick() {
    this.selfLoad = true;
    this._router.navigate([UrlConstants.APPRAISAL]);

  }

  smartGoalClick() {
    this.selfGoalLoad = true;
    this._router.navigate([UrlConstants.SMARTGOAL]);
  }

  guidelineClick() {
    this._router.navigate([UrlConstants.GUIDELINE]);
  }

  reportClick() {
    this._router.navigate([UrlConstants.REPORT])
  }

  registerClick() {
    this._router.navigate([UrlConstants.REGISTER]);
  }

  lmManagementClick(){
    this._router.navigate([UrlConstants.LMMANAGEMENT]);
  }

}
