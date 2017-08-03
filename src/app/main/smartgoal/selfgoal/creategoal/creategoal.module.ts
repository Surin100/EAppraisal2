import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MyDatePickerModule } from 'mydatepicker';
import { AutosizeModule } from '../../../autosize/autosize.module';
import { createGoalRoutes } from './creategoal.routes';
import { CreateGoalComponent } from './creategoal.component';
import { DataService } from '../../../../core/services/data.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AutosizeModule,
    MyDatePickerModule,
    RouterModule.forChild(createGoalRoutes)
  ],
  declarations: [CreateGoalComponent],
  providers: [DataService]
})
export class CreateGoalModule { }
