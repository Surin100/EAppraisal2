import { Component, OnInit } from '@angular/core';

import {AuthenService} from '../../core/services/authen.service';

@Component({
  selector: 'app-smartgoal',
  templateUrl: './smartgoal.component.html',
  styleUrls: ['./smartgoal.component.css']
})
export class SmartGoalComponent implements OnInit {
  selfGoalLoad: Boolean;
  currentUser;

  constructor(private _authenService:AuthenService) {   
    this.currentUser = _authenService.getLoggedInUser();
    // console.log(JSON.stringify(this.currentUser));
  }

  ngOnInit() {
  }
  selfGoalClick(){
    this.selfGoalLoad = true;
  }
  goalApprovalClick(){
    this.selfGoalLoad = false;
  }
  goalApprovedClick(){
    this.selfGoalLoad = false;
  }
  goalGuidelineClick(){
    this.selfGoalLoad = true;
  }
}
