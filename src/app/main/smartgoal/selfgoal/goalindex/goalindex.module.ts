import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { PaginationModule, ModalModule } from 'ngx-bootstrap';
import { MyDatePickerModule } from 'mydatepicker';

import { AutosizeModule } from '../../../autosize/autosize.module';
import { goalIndexRoutes } from './goalindex.routes';
import { GoalIndexComponent } from './goalindex.component';
import { DataService } from '../../../../core/services/data.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AutosizeModule,
    MyDatePickerModule,
    RouterModule.forChild(goalIndexRoutes),
    ModalModule.forRoot(),
    PaginationModule.forRoot()
  ],
  declarations: [GoalIndexComponent],
  providers: [ DataService ]
})
export class GoalIndexModule { }
