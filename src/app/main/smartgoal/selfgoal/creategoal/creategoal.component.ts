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
      associateTitle: this.currentUser.jobTitle,
      associateId: this.currentUser.userName,
      departmentId: this.currentUser.departmentId
    }
  }

  
  ngOnInit() {
    this.smartGoal.totalScore = 0;

    this.smartGoal.goal1 = 0;
    this.smartGoal.goal2 = 0;
    this.smartGoal.goal3 = 0;
    this.smartGoal.goal4 = 0;
  }


  private myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
  };
  private today = new Date();
  temporarydate = { date: { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() } };

  // Generate conclusion
  generateTotalScore() {
    // debugger;
    let noGoals = 0;
    if (this.smartGoal.goal1 > 0) noGoals++;
    if (this.smartGoal.goal2 > 0) noGoals++;
    if (this.smartGoal.goal3 > 0) noGoals++;
    if (this.smartGoal.goal4 > 0) noGoals++;
    this.smartGoal.totalScore = (noGoals == 0) ? 0 : (this.smartGoal.goal1 + this.smartGoal.goal2 + this.smartGoal.goal3 + this.smartGoal.goal4) / noGoals;
  }
  // End of Generate conclusion

  saveSmartGoal() {

  }
}
