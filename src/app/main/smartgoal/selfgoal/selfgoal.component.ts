import { Component, OnInit } from '@angular/core';

import { SmartGoalComponent} from '../smartgoal.component';

@Component({
  selector: 'app-selfgoal',
  templateUrl: './selfgoal.component.html',
  styleUrls: ['./selfgoal.component.css']
})
export class SelfGoalComponent implements OnInit {

  constructor(private _smartGoalComponent: SmartGoalComponent) { this._smartGoalComponent.selfGoalLoad = true; }

  ngOnInit() {
  }

}
