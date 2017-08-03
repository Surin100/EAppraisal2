import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MyDatePickerModule } from 'mydatepicker';

import { CreateComponent } from './create.component';
import { createRoutes } from './create.routes';

import { DataService } from '../../../../core/services/data.service';
import { HandleErrorService } from '../../../../core/services/handle-error.service';
import { NotificationService } from '../../../../core/services/notification.service';
import {UtilityService} from '../../../../core/services/utility.service';
import {AutosizeModule } from '../../../autosize/autosize.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MyDatePickerModule,
    AutosizeModule,
    RouterModule.forChild(createRoutes)
  ],
  providers: [DataService, NotificationService, UtilityService, HandleErrorService],
  declarations: [CreateComponent]
})
export class CreateModule { }
