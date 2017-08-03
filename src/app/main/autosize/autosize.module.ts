import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Autosize } from 'angular2-autosize/angular2-autosize';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [Autosize],
  exports: [Autosize]
})
export class AutosizeModule { }
