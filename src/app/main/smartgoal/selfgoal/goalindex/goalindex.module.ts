import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoalIndexComponent } from './goalindex.component';
import { RouterModule } from '@angular/router';
import { goalIndexRoutes } from './goalindex.routes';

import { DataService } from '../../../../core/services/data.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(goalIndexRoutes)
  ],
  declarations: [GoalIndexComponent],
  providers: [ DataService ]
})
export class GoalIndexModule { }
