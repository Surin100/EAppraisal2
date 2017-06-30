import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

import {AuthenService} from '../core/services/authen.service';
import {LoggedInUser} from '../core/domain/loggedin.user';
import {SystemConstants} from '../core/common/system.constants';
import {UrlConstants} from '../core/common/url.constants';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  user: LoggedInUser;
  constructor(private _authenService:AuthenService, private _router:Router) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER));
    // console.log(JSON.stringify(this.user));
  }
  logout(){
    this._authenService.logout();
  }

  homeClick(){
    this._router.navigate([UrlConstants.HOME]);
  }

  appraisalClick(){
    
  }

  goalClick(){

  }

  guidelineClick(){

  }

  reportClick(){

  }

  registerClick(){
    this._router.navigate([UrlConstants.REGISTER]);
  }

}
