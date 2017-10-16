import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { GuidelineComponent } from './guideline.component';
import { guidelineRoutes } from './guideline.routes'
import { DataService } from '../../../core/services/data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UtilityService } from '../../../core/services/utility.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(guidelineRoutes)
  ],
  providers: [DataService,NotificationService,UtilityService],
  declarations: [GuidelineComponent]
})
export class GuidelineModule { }
