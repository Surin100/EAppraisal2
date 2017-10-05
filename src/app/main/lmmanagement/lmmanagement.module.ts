import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { LMManagementComponent } from './lmmanagement.component';
import { lmmanagementRoutes } from './lmmanagement.routes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(lmmanagementRoutes)
  ],
  declarations: [LMManagementComponent]
})
export class LMManagementModule { }
