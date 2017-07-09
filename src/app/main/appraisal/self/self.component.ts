import { Component, OnInit } from '@angular/core';

import { AppraisalComponent } from '../appraisal.component';

@Component({
  selector: 'app-self',
  templateUrl: './self.component.html',
  styleUrls: ['./self.component.css']
})
export class SelfComponent implements OnInit {
  constructor(private _appraisalComponent: AppraisalComponent) {   this._appraisalComponent.selfLoad = true;}

  ngOnInit() {
  }

}

