import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule} from '@angular/router';

import { MainComponent } from './main.component';
import { mainRoutes} from './main.routes';
import {AuthenService} from '../core/services/authen.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(mainRoutes)
  ],
  providers:[AuthenService],
  declarations: [MainComponent]
})
export class MainModule { }
