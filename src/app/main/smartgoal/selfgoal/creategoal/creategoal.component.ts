import { Component, OnInit, AfterViewInit } from '@angular/core';

import { AuthenService } from '../../../../core/services/authen.service';
import { LoggedInUser } from '../../../../core/domain/loggedin.user';
import { IMyDpOptions } from 'mydatepicker';
import { DataService } from '../../../../core/services/data.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { HandleErrorService } from '../../../../core/services/handle-error.service';
import { MessageConstants } from '../../../../core/common/message.constants';

@Component({
  selector: 'app-creategoal',
  templateUrl: './creategoal.component.html',
  styleUrls: ['./creategoal.component.css']
})
export class CreateGoalComponent implements OnInit {
  smartGoal: any;
  smartGoalFrom;
  smartGoalTo;
  goal1Contents = [];
  goal1Content: any = {};
  goal2Contents = [];
  goal2Content: any = {};
  goal3Contents = [];
  goal3Content: any = {};
  goal4Contents = [];
  goal4Content: any = {};
  height: string;
  personalDevelopmentContents = [];
  personalDevelopmentContent: any = {};
  departmentList = [];
  categoryList = [];
  currentUser: LoggedInUser;
  saveGoalLoading: Boolean = false;

  constructor(private _authenService: AuthenService, private _dataService: DataService, private _notificationService: NotificationService,
    private _utilityService: UtilityService, private _handleErrorService: HandleErrorService) {
    this.currentUser = _authenService.getLoggedInUser();

    this.departmentList = JSON.parse(this.currentUser.departmentList);
    this.categoryList = JSON.parse(this.currentUser.categoryList);
  }

  ngOnInit() {
    this.smartGoal = {
      associateName: this.currentUser.fullName,
      associateTitle: this.currentUser.jobTitle,
      associateId: this.currentUser.userName,
      departmentId: this.currentUser.departmentId
    }
    this.smartGoal.totalScore = 0;

    this.smartGoal.goal1 = 0;
    this.smartGoal.goal2 = 0;
    this.smartGoal.goal3 = 0;
    this.smartGoal.goal4 = 0;
  }

  ngAfterViewInit() {
    document.getElementById('goalContentTableHeader').style.height = document.getElementById('goalTableHeader').offsetHeight + 'px';
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

  saveSmartGoal(valid) {
    if (!valid) return;
    this.saveGoalLoading = true;
    // Date problem
    let _reviewMonth = this.temporarydate.date.month.toString().length < 2 ? '0' + this.temporarydate.date.month : this.temporarydate.date.month;
    let _reviewDay = this.temporarydate.date.day.toString().length < 2 ? '0' + this.temporarydate.date.day : this.temporarydate.date.day;
    let _reviewDate: string = this.temporarydate.date.year + '-' + _reviewMonth + '-' + _reviewDay + 'T12:00:00Z'
    this.smartGoal.reviewDate = new Date(_reviewDate);

    let _fromMonth = this.smartGoalFrom.date.month.toString().length < 2 ? '0' + this.smartGoalFrom.date.month : this.smartGoalFrom.date.month;
    let _fromDay = this.smartGoalFrom.date.day.toString().length < 2 ? '0' + this.smartGoalFrom.date.day : this.smartGoalFrom.date.day;
    let _fromDate: string = this.smartGoalFrom.date.year + '-' + _fromMonth + '-' + _fromDay + 'T12:00:00Z'
    this.smartGoal.From = new Date(_fromDate);

    let _toMonth = this.smartGoalTo.date.month.toString().length < 2 ? '0' + this.smartGoalTo.date.month : this.smartGoalTo.date.month;
    let _toDay = this.smartGoalTo.date.day.toString().length < 2 ? '0' + this.smartGoalTo.date.day : this.smartGoalTo.date.day;
    let _toDate: string = this.smartGoalTo.date.year + '-' + _toMonth + '-' + _toDay + 'T12:00:00Z'
    this.smartGoal.To = new Date(_toDate);
    // End date problem
    if (this.goal1Content.plan) this.goal1Contents.push(this.goal1Content);
    if (this.goal2Content.plan) this.goal2Contents.push(this.goal2Content);
    if (this.goal3Content.plan) this.goal3Contents.push(this.goal3Content);
    if (this.goal4Content.plan) this.goal4Contents.push(this.goal4Content);
    if (this.personalDevelopmentContent.plan) this.personalDevelopmentContents.push(this.personalDevelopmentContent);

    this.smartGoal.goal1Content = JSON.stringify(this.goal1Contents);
    this.smartGoal.goal2Content = JSON.stringify(this.goal2Contents);
    this.smartGoal.goal3Content = JSON.stringify(this.goal3Contents);
    this.smartGoal.goal4Content = JSON.stringify(this.goal4Contents);
    this.smartGoal.personalDevelopmentContent = JSON.stringify(this.personalDevelopmentContents);

    this._dataService.post('/api/SmartGoal/SaveSmartGoal', this.smartGoal).subscribe((response: any) => {
      if (this.smartGoal.statusId == 'N') this._notificationService.printSuccessMessage(MessageConstants.SAVE_DRAFT_SUCCESS);
      if (this.smartGoal.statusId == 'S') this._notificationService.printSuccessMessage(MessageConstants.SUBMIT_APPRAISAL_SUCCESS);
      this._utilityService.navigate('/main/smartgoal');
    }, error => {
      // alert(error);
      if (JSON.parse(error._body).Message == "Your goal has been submitted but we cannot send email.") {
        this._notificationService.printSuccessMessage("Your goal has been submitted but we cannot send email.");
        this._utilityService.navigate('/main/smartgoal');
      }
      else {
        this._handleErrorService.handleError(error);
        this.saveGoalLoading = false;
      }
    });
  }

  // Goal content
  addContent(name: string): void {
    switch (name) {
      case 'goal1':
        if (!this.goal1Content.plan) return;
        let newGoal1Content = {
          plan: this.goal1Content.plan,
          date: this.goal1Content.date,
          measure: this.goal1Content.measure
        };
        this.goal1Contents.push(newGoal1Content);
        this.goal1Content = {};
        document.getElementById('goal1ContentPlan').focus();
        break;
      case 'goal2':
        if (!this.goal2Content.plan) return;
        let newGoal2Content = {
          plan: this.goal2Content.plan,
          date: this.goal2Content.date,
          measure: this.goal2Content.measure
        };
        this.goal2Contents.push(newGoal2Content);
        this.goal2Content = {};
        document.getElementById('goal2ContentPlan').focus();
        break;
      case 'goal3':
        if (!this.goal3Content.plan) return;
        let newGoal3Content = {
          plan: this.goal3Content.plan,
          date: this.goal3Content.date,
          measure: this.goal3Content.measure
        };
        this.goal3Contents.push(newGoal3Content);
        this.goal3Content = {};
        document.getElementById('goal3ContentPlan').focus();
        break;
      case 'goal4':
        if (!this.goal4Content.plan) return;
        let newGoal4Content = {
          plan: this.goal4Content.plan,
          date: this.goal4Content.date,
          measure: this.goal4Content.measure
        };
        this.goal4Contents.push(newGoal4Content);
        this.goal4Content = {};
        document.getElementById('goal4ContentPlan').focus();
        break;
    }
  }

  removeContent(name: string, index: number) {
    switch (name) {
      case 'goal1':
        if (!this.goal1Contents[index].plan.trim()) {
          this.goal1Contents.splice(index, 1);
          document.getElementById('goal1ContentPlan').focus();
        }
        break;
      case 'goal2':
        if (!this.goal2Contents[index].plan.trim()) {
          this.goal2Contents.splice(index, 1);
          document.getElementById('goal2ContentPlan').focus();
        }
        break;
      case 'goal3':
        if (!this.goal3Contents[index].plan.trim()) {
          this.goal3Contents.splice(index, 1);
          document.getElementById('goal3ContentPlan').focus();
        }
        break;
      case 'goal4':
        if (!this.goal4Contents[index].plan.trim()) {
          this.goal4Contents.splice(index, 1);
          document.getElementById('goal4ContentPlan').focus();
        }
        break;
    }
  }

  // End of Goal content

  addPersonalDevelopmentContent(): void {
    if (!this.personalDevelopmentContent.plan) return;
    let newPersonalDevelopmentContent = {
      plan: this.personalDevelopmentContent.plan,
      date: this.personalDevelopmentContent.date,
      measure: this.personalDevelopmentContent.measure
    };
    this.personalDevelopmentContents.push(newPersonalDevelopmentContent);
    this.personalDevelopmentContent = {};
    document.getElementById('personalDevelopmentContentPlan').focus();
  }

  removePersonalDevelopmentContent(index: number) {
    if (!this.personalDevelopmentContents[index].plan.trim()) {
      this.personalDevelopmentContents.splice(index, 1);
      document.getElementById('personalDevelopmentContentPlan').focus();
    }
  }

  goalIsValid(): Boolean {
    let IsValid: Boolean = true;
    if (this.smartGoal.goal1 == 0 && this.goal1Contents.length > 0) IsValid = false;
    if (this.smartGoal.goal2 == 0 && this.goal2Contents.length > 0) IsValid = false;
    if (this.smartGoal.goal3 == 0 && this.goal3Contents.length > 0) IsValid = false;
    if (this.smartGoal.goal4 == 0 && this.goal4Contents.length > 0) IsValid = false;
    if (this.smartGoal.goal1 == 0 && this.goal1Content.plan) IsValid = false;
    if (this.smartGoal.goal2 == 0 && this.goal2Content.plan) IsValid = false;
    if (this.smartGoal.goal3 == 0 && this.goal3Content.plan) IsValid = false;
    if (this.smartGoal.goal4 == 0 && this.goal4Content.plan) IsValid = false;
    if (this.goal1Contents.length == 0 && this.goal1Contents.length == 0 && this.goal1Contents.length == 0 && this.goal1Contents.length == 0
      && !this.goal1Content.plan && !this.goal2Content.plan && !this.goal3Content.plan && !this.goal4Content.plan) IsValid = false;
    return IsValid;
  }

  uncheckGoal(name: string) {
    // alert('b')
    switch (name) {
      case 'goal1':
        this.smartGoal.goal1 = 0; this.generateTotalScore(); break;
      case 'goal2':
        this.smartGoal.goal2 = 0; this.generateTotalScore(); break;
      case 'goal3':
        this.smartGoal.goal3 = 0; this.generateTotalScore(); break;
      case 'goal4':
        this.smartGoal.goal4 = 0; this.generateTotalScore(); break;
      default: return;
    }
  }

  uncheckKeyPerformance(name: string): Boolean {
    // alert('a');
    // debugger;
    switch (name) {
      case 'goal1':
        this.smartGoal.goal1Customer = false;
        this.smartGoal.goal1Finance = false;
        this.smartGoal.goal1Employee = false;
        this.smartGoal.goal1Operating = false;
        break;
      case 'goal2':
        this.smartGoal.goal2Customer = false;
        this.smartGoal.goal2Finance = false;
        this.smartGoal.goal2Employee = false;
        this.smartGoal.goal2Internal = false;
        break;
      case 'goal3':
        this.smartGoal.goal3Customer = false;
        this.smartGoal.goal3Finance = false;
        this.smartGoal.goal3Employee = false;
        this.smartGoal.goal3Internal = false;
        break;
      case 'goal4':
        this.smartGoal.goal4Customer = false;
        this.smartGoal.goal4Finance = false;
        this.smartGoal.goal4Employee = false;
        this.smartGoal.goal4Internal = false;
        break;
    }
    return false;
  }
}
