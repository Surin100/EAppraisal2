import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule} from '@angular/router';

import { MainComponent } from './main.component';
import { mainRoutes} from './main.routes';
import {AuthenService} from '../core/services/authen.service';
import {HandleErrorService} from '../core/services/handle-error.service';
import {NotificationService} from '../core/services/notification.service';
import {UtilityService} from '../core/services/utility.service';
import {DataService} from '../core/services/data.service';
import {SignalrService} from '../core/services/signalr.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(mainRoutes)
  ],
  providers:[AuthenService, HandleErrorService, NotificationService, UtilityService, DataService, SignalrService],
  declarations: [MainComponent]
})
export class MainModule { }
