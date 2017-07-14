import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MyDatePickerModule } from 'mydatepicker';

import { createGoalRoutes } from './creategoal.routes';
import { CreateGoalComponent } from './creategoal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MyDatePickerModule,
    RouterModule.forChild(createGoalRoutes)
  ],
  declarations: [CreateGoalComponent]
})
export class CreateGoalModule { }
