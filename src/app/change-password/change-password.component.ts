import { Component, OnInit } from '@angular/core';

import { DataService } from '../core/services/data.service';
import { NotificationService } from '../core/services/notification.service';
import { MessageConstants } from '../core/common/message.constants';
import { SystemConstants } from '../core/common/system.constants';
import { UtilityService } from '../core/services/utility.service';
import { AuthenService } from '../core/services/authen.service';
import { HandleErrorService } from '../core/services/handle-error.service';
import { LoggedInUser } from '../core/domain/loggedin.user';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})


export class ChangePasswordComponent implements OnInit {
  loading = false;
  model: any = {};
  currentUser: LoggedInUser;

  constructor(private _dataService: DataService, private _notificationService: NotificationService, private _utilityService:UtilityService,
    private _authenService: AuthenService, private _handleErrorService: HandleErrorService) { }

  ngOnInit() {
    var s = document.getElementsByTagName('body')[0];
    s.setAttribute('class', 'login');
    this.currentUser = this._authenService.getLoggedInUser();
  }

  changePassword(valid: Boolean) {
    if (!valid) return;
    this.loading = true;
    if(this.currentUser.roles.includes('NewUser')) this.model.oldPassword = "";
    this._dataService.post('/api/Account/ChangePassword', this.model).subscribe((response: any) => {
      this._notificationService.printSuccessMessage(MessageConstants.CHANGEPASSWORD_SUCCESS);
      localStorage.removeItem(SystemConstants.CURRENT_USER);
      this._utilityService.navigateToLogin();
    }, error => {
      this._handleErrorService.handleError(error)
      this.loading = false;
    });

  }

}
