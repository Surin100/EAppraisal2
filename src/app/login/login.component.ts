import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenService } from '../core/services/authen.service';
import { DataService } from '../core/services/data.service';
import { HandleErrorService } from '../core/services/handle-error.service';
import { NotificationService } from '../core/services/notification.service';
import { MessageConstants } from '../core/common/message.constants';
import { LoggedInUser } from '../core/domain/loggedin.user';
import { SystemConstants } from '../core/common/system.constants';
import { UrlConstants } from '../core/common/url.constants';

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
    private _router: Router, private _handleErrorService: HandleErrorService, private _dataService: DataService
  ) { }

  ngOnInit() {
    var s = document.getElementsByTagName('body')[0];
    s.setAttribute('class', 'login');
  }

  login() {
    this.loading = true;
    if(this.model.password==undefined) this.model.password = '';
    // alert(this.model.password);
    
    let loginPromise =  new Promise((Resolve, Reject) => {
      this._authenService.login(this.model.username, this.model.password).subscribe((data) => {
        // console.log(data);
        let token: LoggedInUser = data;
        Resolve(token);
      }, error => {
        this._handleErrorService.handleError(error);
        this.loading = false;
      });
    });
    loginPromise.then((data: LoggedInUser)=> {
      this._dataService.get('/api/Account/LoggedUserInfo').subscribe((response)=>{
        let user: LoggedInUser = response;
        if (data.access_token) {
          user.access_token = data.access_token;
          user['.expires'] = data['.expires'];
          user['.issued'] = data['.issued'];
          user['expires_in'] = data['expires_in'];
          user['token_type'] = data['token_type'];

          localStorage.removeItem(SystemConstants.CURRENT_USER);
          localStorage.setItem(SystemConstants.CURRENT_USER, JSON.stringify(user));
          // this._router.navigate([UrlConstants.HOME]);
          window.location.href = UrlConstants.HOME;
          // window.location.reload(true);
        }
        this.loading = false;
        // console.log(user);
      }, error => {
        this._handleErrorService.handleError(error);
        this.loading = false;
      });

    });
  }
}
