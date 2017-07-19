import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {RouterModule} from '@angular/router';

import { RegisterComponent } from './register.component';
import {registerRoutes} from './register.routes';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { HandleErrorService } from '../../core/services/handle-error.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(registerRoutes)
  ],
  providers:[DataService, NotificationService, HandleErrorService],
  declarations: [RegisterComponent]
})
export class RegisterModule { }
