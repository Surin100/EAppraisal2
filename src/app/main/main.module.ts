import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule} from '@angular/router';

import { MainComponent } from './main.component';
import { mainRoutes} from './main.routes';
import {AuthenService} from '../core/services/authen.service';
import {HandleErrorService} from '../core/services/handle-error.service';
import {NotificationService} from '../core/services/notification.service';
import {UtilityService} from '../core/services/utility.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(mainRoutes)
  ],
  providers:[AuthenService, HandleErrorService, NotificationService, UtilityService],
  declarations: [MainComponent]
})
export class MainModule { }
