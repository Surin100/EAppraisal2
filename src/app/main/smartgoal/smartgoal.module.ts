import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { smartGoalRoutes } from './smartgoal.routes';
import { SmartGoalComponent } from './smartgoal.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(smartGoalRoutes)
  ],
  declarations: [SmartGoalComponent]
})
export class SmartGoalModule { }
