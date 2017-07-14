import { Component, OnInit } from '@angular/core';

import { AuthenService } from '../../../../core/services/authen.service';
import { LoggedInUser } from '../../../../core/domain/loggedin.user';
import { IMyDpOptions } from 'mydatepicker';

@Component({
  selector: 'app-creategoal',
  templateUrl: './creategoal.component.html',
  styleUrls: ['./creategoal.component.css']
})
export class CreateGoalComponent implements OnInit {
  smartGoal: any = {};
  departmentList = [];
  currentUser: LoggedInUser;

  constructor(private _authenService: AuthenService) { 
    this.currentUser = _authenService.getLoggedInUser();

    this.departmentList = JSON.parse(this.currentUser.departmentList);

    this.smartGoal = {
      associateName: this.currentUser.fullName,
      associateTitle: this.currentUser.userTitle,
      associateId: this.currentUser.userName,
      departmentId: this.currentUser.departmentId
    }
  }

  private myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
  };
  private today = new Date();
  temporarydate = { date: { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() } };

  // Generate conclusion
  totalScore = 0;

  goal1 = 0;
  goal2 = 0;
  goal3 = 0;
  goal4 = 0;

  generateTotalScore(name: string, value: number) {
    // debugger;
    switch (name) {
      case 'goal1':
        this.goal1 = value; break;
      case 'goal2':
        this.goal2 = value; break;
      case 'goal3':
        this.goal3 = value; break;
      case 'goal4':
        this.goal4 = value; break;
      default: return;
    }

    let noGoals = 0;
    if (this.goal1 > 0) noGoals++;
    if (this.goal2 > 0) noGoals++;
    if (this.goal3 > 0) noGoals++;
    if (this.goal4 > 0) noGoals++;
    this.totalScore = (noGoals == 0) ? 0 : (this.goal1 + this.goal2 + this.goal3 + this.goal4) / noGoals;
  }
  // End of Generate conclusion
  
  ngOnInit() {
  }

  saveSmartGoal(){

  }
}
