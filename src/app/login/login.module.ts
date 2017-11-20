import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {FocusModule} from 'angular2-focus';

import { LoginComponent } from './login.component';
import { AuthenService } from '../core/services/authen.service';
import { HandleErrorService } from '../core/services/handle-error.service';
import { DataService } from '../core/services/data.service';
import { UtilityService } from '../core/services/utility.service';
import { NotificationService } from '../core/services/notification.service';
import { loginRoutes } from './login.routes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FocusModule.forRoot(),
    RouterModule.forChild(loginRoutes)
  ],
  providers: [AuthenService, UtilityService, NotificationService, HandleErrorService, DataService],
  declarations: [LoginComponent]
})
export class LoginModule { }
