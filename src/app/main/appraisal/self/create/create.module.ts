import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Autosize } from 'angular2-autosize/angular2-autosize';
import { MyDatePickerModule } from 'mydatepicker';

import { CreateComponent } from './create.component';
import { createRoutes } from './create.routes';

import { DataService } from '../../../../core/services/data.service';
import { NotificationService } from '../../../../core/services/notification.service';
import {UtilityService} from '../../../../core/services/utility.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MyDatePickerModule,
    RouterModule.forChild(createRoutes)
  ],
  providers: [DataService, NotificationService, UtilityService],
  declarations: [CreateComponent, Autosize]
})
export class CreateModule { }
