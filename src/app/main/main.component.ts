import { Component, OnInit } from '@angular/core';

import {AuthenService} from '../core/services/authen.service';
import {LoggedInUser} from '../core/domain/loggedin.user';
import {SystemConstants} from '../core/common/system.constants';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  user: LoggedInUser;
  constructor(private _authenService:AuthenService) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER));
    // console.log(JSON.stringify(this.user));
  }
  logout(){
    this._authenService.logout();
  }

}
