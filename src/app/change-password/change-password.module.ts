import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {FocusModule} from 'angular2-focus';

import { ChangePasswordComponent } from './change-password.component';
import { changePasswordRoutes } from './change-password.routes';
import { DataService } from '../core/services/data.service';
import { AuthenService } from '../core/services/authen.service';
import { NotificationService } from '../core/services/notification.service';
import { HandleErrorService } from '../core/services/handle-error.service';
import { UtilityService } from '../core/services/utility.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FocusModule.forRoot(),
    RouterModule.forChild(changePasswordRoutes)
  ],
  providers:[DataService, AuthenService, NotificationService, UtilityService, HandleErrorService],
  declarations: [ChangePasswordComponent]
})
export class ChangePasswordModule { }
