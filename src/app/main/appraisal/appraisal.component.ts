import { Component, OnInit } from '@angular/core';

import {AuthenService} from '../../core/services/authen.service';

@Component({
  selector: 'app-appraisal',
  templateUrl: './appraisal.component.html',
  styleUrls: ['./appraisal.component.css']
})
export class AppraisalComponent implements OnInit {
  selfLoad: Boolean;
  currentUser;

  constructor(private _authenService:AuthenService) {   
    this.currentUser = _authenService.getLoggedInUser();
    // console.log(JSON.stringify(this.currentUser));
  }


  ngOnInit() {

  }

  selfClick() {
    this.selfLoad = true;
  }
  approvalClick() {
    this.selfLoad = false;
  }
  approvedClick() {
    this.selfLoad = false;
  }



}
