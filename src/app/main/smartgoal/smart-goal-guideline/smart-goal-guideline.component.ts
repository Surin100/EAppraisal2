import { Component, OnInit } from '@angular/core';

import { HandleErrorService } from '../../../core/services/handle-error.service';
import { DataService } from '../../../core/services/data.service';
import { SmartGoalComponent} from '../smartgoal.component';


@Component({
  selector: 'app-smart-goal-guideline',
  templateUrl: './smart-goal-guideline.component.html',
  styleUrls: ['./smart-goal-guideline.component.css']
})
export class SmartGoalGuidelineComponent implements OnInit {
  guidelineContent: string;

  constructor(private _handleErrorService: HandleErrorService, private _dataService:DataService,
    private _smartGoalComponent: SmartGoalComponent) { 
    this._smartGoalComponent.selfGoalLoad = true;
  }

  ngOnInit() {
    this._dataService.get('/api/Guideline/GetGuideline?Id=SmartGoal').subscribe((respone: string) => {
      this.guidelineContent = respone;
    }, error => this._handleErrorService.handleError(error));
  }

}
