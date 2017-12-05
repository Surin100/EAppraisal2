import { Injectable } from '@angular/core';

import { MessageConstants } from '../common/message.constants';
import { SystemConstants } from '../common/system.constants';
import { NotificationService } from './notification.service';
import { UtilityService } from './utility.service';


@Injectable()
export class HandleErrorService {

  constructor(private _notificationService:NotificationService, private _utilityService:UtilityService) { }
  
  public handleError(error: any) {
    // alert(JSON.stringify(JSON.parse(error._body).ModelState));
    if (error.status == 401) {
      // localStorage.removeItem(SystemConstants.CURRENT_USER);
      sessionStorage.removeItem(SystemConstants.CURRENT_USER);
      this._notificationService.printErrorMessage(MessageConstants.LOGIN_AGAIN_MSG);
      // console.log(localStorage.removeItem(SystemConstants.CURRENT_USER));
      this._utilityService.navigateToLogin();
    }
    else if (error.status == 0 || error.status == 500) {
      this._notificationService.printErrorMessage(MessageConstants.SYSTEM_ERROR_MSG);
    }
    else if (JSON.parse(error._body).error_description) {
      this._notificationService.printErrorMessage(JSON.parse(error._body).error_description);
    }
    else if (JSON.parse(error._body).ModelState) {
      for (var x in JSON.parse(error._body).ModelState) {
        this._notificationService.printErrorMessage(JSON.parse(error._body).ModelState[x][0]);
        break
      }
    }
    else if (JSON.parse(error._body).Message) {
      this._notificationService.printErrorMessage(JSON.parse(error._body).Message);
    }
    else {
      let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'System Error';
      this._notificationService.printErrorMessage(errMsg);
      // return Observable.throw(errMsg);
    }
  }

}
