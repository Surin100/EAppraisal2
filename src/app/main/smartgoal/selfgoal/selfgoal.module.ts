import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { selfGoalRoutes } from './selfgoal.routes';
import { SelfGoalComponent } from './selfgoal.component';
import { GoalIndexComponent } from './goalindex/goalindex.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(selfGoalRoutes)
  ],
  declarations: [SelfGoalComponent]
})
export class SelfGoalModule { }
