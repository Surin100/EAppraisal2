import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { PaginationModule } from 'ngx-bootstrap';

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
    PaginationModule.forRoot(),
    RouterModule.forChild(indexRoutes)
  ],
  providers:[DataService, NotificationService, UtilityService, HandleErrorService],
  declarations: [IndexComponent]
})
export class IndexModule { }
