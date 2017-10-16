import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule} from '@angular/router';

import { SmartGoalGuidelineComponent } from './smart-goal-guideline.component';
import {smartGoalGuidelineRoutes}  from './smart-goal-guideline.routes';
import { DataService } from '../../../core/services/data.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(smartGoalGuidelineRoutes)
  ],
  declarations: [SmartGoalGuidelineComponent],
  providers: [DataService]
})
export class SmartGoalGuidelineModule { }
