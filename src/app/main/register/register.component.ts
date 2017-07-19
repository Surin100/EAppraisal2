import { Component, OnInit } from '@angular/core';

import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { HandleErrorService } from '../../core/services/handle-error.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user:any ={};
  resetPasswordLoading:Boolean =false;
  constructor(private _dataService: DataService, private _notificationService:NotificationService,
    private _handleErrorService: HandleErrorService
  ) { }

  ngOnInit() {
  }

  resetPassword(){
    if(!this.user.userName) return;
    this.resetPasswordLoading = true;
    // debugger
    this._dataService.post('/api/Account/ResetPassword',this.user).subscribe((response:any)=>{
      this._notificationService.printSuccessMessage('The password has been reset.');
      this.resetPasswordLoading = false;
    }, error=> {
      this._handleErrorService.handleError(error);
      this.resetPasswordLoading = false;
    });
  }

}
