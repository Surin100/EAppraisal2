import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { PaginationModule, ModalModule } from 'ngx-bootstrap';
import { MyDatePickerModule } from 'mydatepicker';

import { IndexComponent } from './index.component';
import { indexRoutes } from './index.routes';
import { DataService } from '../../../../core/services/data.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { HandleErrorService } from '../../../../core/services/handle-error.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MyDatePickerModule,
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    RouterModule.forChild(indexRoutes)
  ],
  providers:[DataService, NotificationService, UtilityService, HandleErrorService],
  declarations: [IndexComponent]
})
export class IndexModule { }
