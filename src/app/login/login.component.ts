import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenService } from '../core/services/authen.service';
import { HandleErrorService } from '../core/services/handle-error.service';
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
    private _router: Router, private _handleErrorService: HandleErrorService
  ) { }

  ngOnInit() {
    var s = document.getElementsByTagName('body')[0];
    s.setAttribute('class', 'login');
  }

  login() {
    this.loading = true;
    if(this.model.password==undefined) this.model.password = '';
    // alert(this.model.password);
    this._authenService.login(this.model.username, this.model.password).subscribe((data) => {
      this.loading = false;
    }, error => {
      this._handleErrorService.handleError(error);
      this.loading = false;
    });
  }
}
