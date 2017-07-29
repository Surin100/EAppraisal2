import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { PaginationModule, ModalModule } from 'ngx-bootstrap';

import { ApprovedComponent } from './approved.component';
import { approvedRoutes } from './approved.routes';
import { DataService } from '../../../core/services/data.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    RouterModule.forChild(approvedRoutes)
  ],
  providers: [DataService],
  declarations: [ApprovedComponent]
})
export class ApprovedModule { }
