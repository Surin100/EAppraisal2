import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenService } from '../core/services/authen.service';
import { DataService } from '../core/services/data.service';
import { NotificationService } from '../core/services/notification.service';
import { MessageConstants } from '../core/common/message.constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading = false;
  model: any = {};
  returnUrl: string;
  constructor(private _authenService: AuthenService, private _notificationService: NotificationService,
    private _dataService:DataService, private _router: Router
  ) { }

  ngOnInit() {
    var s = document.getElementsByTagName('body')[0];
    s.setAttribute('class', 'login');
  }

  login() {
    this.loading = true;
    this._authenService.login(this.model.username, this.model.password).subscribe((data) => {
    }, error => {
      this._dataService.handleError(error);
      this.loading = false;
    });
  }

}
