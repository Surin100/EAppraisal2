import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SelfComponent } from './self.component';
import { selfRoutes } from './self.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(selfRoutes)
  ],
  declarations: [SelfComponent]
})
export class SelfModule { }
