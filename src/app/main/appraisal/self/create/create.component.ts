import { Component, OnInit } from '@angular/core';

import { IMyDpOptions } from 'mydatepicker';

import { AuthenService } from '../../../../core/services/authen.service';
import { LoggedInUser } from '../../../../core/domain/loggedin.user';
import { DataService } from '../../../../core/services/data.service';
import { HandleErrorService } from '../../../../core/services/handle-error.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { MessageConstants } from '../../../../core/common/message.constants';
import { SystemConstants } from '../../../../core/common/system.constants';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  supervisoryChevron = false;
  supervisoryToggle = false;
  leadershipChevron = false;
  leadershipToggle = false;
  appraisal: any = {};
  departmentList = [];
  categoryList = []
  currentUser: LoggedInUser;
  loading: Boolean;
  appraisalFrom;
  appraisalTo;
  public baseFolder: string = SystemConstants.BASE_API;

  private myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
  };
  private today = new Date();
  // Initialized to specific date (09.10.2018).
  temporarydate = { date: { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() } };

  constructor(private _authenService: AuthenService, private _dataService: DataService, private _notificationService: NotificationService,
    private _utilityService: UtilityService, private _handleErrorService: HandleErrorService
  ) {

    this.currentUser = _authenService.getLoggedInUser();

    this.departmentList = JSON.parse(this.currentUser.departmentList);

    this.categoryList = JSON.parse(this.currentUser.categoryList);

    this.appraisal = {
      associateName: this.currentUser.fullName,
      associateTitle: this.currentUser.jobTitle,
      associateId: this.currentUser.userName,
      departmentId: this.currentUser.departmentId
    }
    // alert(JSON.stringify(this.currentUser.depart));
    // debugger 
    if (this.currentUser.employeeLvId == 'WK') {
      this.supervisoryToggle = true;
      this.leadershipToggle = true;
    }
    else if (this.currentUser.employeeLvId == 'SV') {
      this.leadershipToggle = true;
    }
  }

  ngOnInit() {
    this.appraisal.subTotal1 = 0;
    this.appraisal.subTotal2 = 0;
    this.appraisal.conclusion = 0;

    this.appraisal.customerDriven = 0;
    this.appraisal.questForExcellence = 0;
    this.appraisal.teamWork = 0;
    this.appraisal.respectAndTrust = 0;
    this.appraisal.enterprising = 0;
    this.appraisal.communication = 0;
    this.appraisal.dependability = 0;
    this.appraisal.quantityOfWork = 0;
    this.appraisal.qualityOfWork = 0;

    this.appraisal.personalEfficiency = 0;
    this.appraisal.workforceScheduling = 0;
    this.appraisal.qualityManagement = 0;
    this.appraisal.performanceManagement = 0;
    this.appraisal.successionPlanning = 0;
    this.appraisal.managingConflicts = 0;
    this.appraisal.celebrateResults = 0;

    this.appraisal.leadWithVision = 0;
    this.appraisal.alignAndEngage = 0;
    this.appraisal.talentMagnet = 0;

    this.appraisal.goal1 = 0;
    this.appraisal.goal2 = 0;
    this.appraisal.goal3 = 0;
    this.appraisal.goal4 = 0;
  }

  supervisoryClick() {
    this.supervisoryChevron = !this.supervisoryChevron;
  }
  leadershipClick() {
    this.leadershipChevron = !this.leadershipChevron;
  }

  saveAppraisal(valid: Boolean) {
    if (!valid) return;
    // Date problem
    let _appraisalMonth = this.temporarydate.date.month.toString().length < 2 ? '0' + this.temporarydate.date.month : this.temporarydate.date.month;
    let _appraisalDay = this.temporarydate.date.day.toString().length < 2 ? '0' + this.temporarydate.date.day : this.temporarydate.date.day;
    let _reviewDate: string = this.temporarydate.date.year + '-' + _appraisalMonth + '-' + _appraisalDay + 'T12:00:00Z'
    this.appraisal.reviewDate = new Date(_reviewDate);

    let _fromMonth = this.appraisalFrom.date.month.toString().length < 2 ? '0' + this.appraisalFrom.date.month : this.appraisalFrom.date.month;
    let _fromDay = this.appraisalFrom.date.day.toString().length < 2 ? '0' + this.appraisalFrom.date.day : this.appraisalFrom.date.day;
    let _fromDate: string = this.appraisalFrom.date.year + '-' + _fromMonth + '-' + _fromDay + 'T12:00:00Z'
    this.appraisal.From = new Date(_fromDate);

    let _toMonth = this.appraisalTo.date.month.toString().length < 2 ? '0' + this.appraisalTo.date.month : this.appraisalTo.date.month;
    let _toDay = this.appraisalTo.date.day.toString().length < 2 ? '0' + this.appraisalTo.date.day : this.appraisalTo.date.day;
    let _toDate: string = this.appraisalTo.date.year + '-' + _toMonth + '-' + _toDay + 'T12:00:00Z'
    this.appraisal.To = new Date(_toDate);
    // End date problem

    // alert(JSON.stringify(this.appraisal));

    this.loading = true;
    this._dataService.post('/api/appraisal/create', JSON.stringify(this.appraisal)).subscribe((response: any) => {
      // debugger
      if (this.appraisal.statusId == 'N') this._notificationService.printSuccessMessage(MessageConstants.SAVE_DRAFT_SUCCESS);
      if (this.appraisal.statusId == 'S') this._notificationService.printSuccessMessage(MessageConstants.SUBMIT_APPRAISAL_SUCCESS);
      this._utilityService.navigate('/main/appraisal');
    }, error => {
      // alert(JSON.stringify(error));
      if (JSON.parse(error._body).Message == "Your appraisal has been submitted but we cannot send email.") {
        this._notificationService.printSuccessMessage("Your appraisal has been submitted but we cannot send email.");
        this._utilityService.navigate('/main/appraisal');
      }
      else {
        this._handleErrorService.handleError(error);
        this.loading = false;
      }
    });
  }

  // Generate conclusion

  generateSubTotal1() {
    let noCompetencies = 0;
    if (this.appraisal.customerDriven > 0) noCompetencies++;
    if (this.appraisal.questForExcellence > 0) noCompetencies++;
    if (this.appraisal.teamWork > 0) noCompetencies++;
    if (this.appraisal.respectAndTrust > 0) noCompetencies++;
    if (this.appraisal.enterprising > 0) noCompetencies++;
    if (this.appraisal.communication > 0) noCompetencies++;
    if (this.appraisal.dependability > 0) noCompetencies++;
    if (this.appraisal.quantityOfWork > 0) noCompetencies++;
    if (this.appraisal.qualityOfWork > 0) noCompetencies++;

    if (this.appraisal.personalEfficiency > 0) noCompetencies++;
    if (this.appraisal.workforceScheduling > 0) noCompetencies++;
    if (this.appraisal.qualityManagement > 0) noCompetencies++;
    if (this.appraisal.performanceManagement > 0) noCompetencies++;
    if (this.appraisal.successionPlanning > 0) noCompetencies++;
    if (this.appraisal.managingConflicts > 0) noCompetencies++;
    if (this.appraisal.celebrateResults > 0) noCompetencies++;
    if (this.appraisal.leadWithVision > 0) noCompetencies++;
    if (this.appraisal.alignAndEngage > 0) noCompetencies++;
    if (this.appraisal.talentMagnet > 0) noCompetencies++;

    this.appraisal.subTotal1 = (noCompetencies == 0) ? 0 : (
      this.appraisal.customerDriven +
      this.appraisal.questForExcellence +
      this.appraisal.teamWork +
      this.appraisal.respectAndTrust +
      this.appraisal.enterprising +
      this.appraisal.communication +
      this.appraisal.dependability +
      this.appraisal.quantityOfWork +
      this.appraisal.qualityOfWork +

      this.appraisal.personalEfficiency +
      this.appraisal.workforceScheduling +
      this.appraisal.qualityManagement +
      this.appraisal.performanceManagement +
      this.appraisal.successionPlanning +
      this.appraisal.managingConflicts +
      this.appraisal.celebrateResults +

      this.appraisal.leadWithVision +
      this.appraisal.alignAndEngage +
      this.appraisal.talentMagnet)
      / noCompetencies;

    this.appraisal.conclusion = this.appraisal.subTotal1 * 0.3 + this.appraisal.subTotal2 * 0.7
  }

  generateSubTotal2() {
    let noGoals = 0;
    if (this.appraisal.goal1 > 0) noGoals++;
    if (this.appraisal.goal2 > 0) noGoals++;
    if (this.appraisal.goal3 > 0) noGoals++;
    if (this.appraisal.goal4 > 0) noGoals++;
    this.appraisal.subTotal2 = (noGoals == 0) ? 0 : (this.appraisal.goal1 + this.appraisal.goal2 + this.appraisal.goal3 + this.appraisal.goal4) / noGoals;

    this.appraisal.conclusion = this.appraisal.subTotal1 * 0.3 + this.appraisal.subTotal2 * 0.7
  }

  exportExcel() {
      //  alert(JSON.stringify(this.appraisalFrom));
    // Date problem
    let _appraisalMonth = this.temporarydate.date.month.toString().length < 2 ? '0' + this.temporarydate.date.month : this.temporarydate.date.month;
    let _appraisalDay = this.temporarydate.date.day.toString().length < 2 ? '0' + this.temporarydate.date.day : this.temporarydate.date.day;
    let _reviewDate: string = this.temporarydate.date.year + '-' + _appraisalMonth + '-' + _appraisalDay + 'T12:00:00Z'
    this.appraisal.reviewDate = new Date(_reviewDate);

    let _fromMonth = this.appraisalFrom.date.month.toString().length < 2 ? '0' + this.appraisalFrom.date.month : this.appraisalFrom.date.month;
    let _fromDay = this.appraisalFrom.date.day.toString().length < 2 ? '0' + this.appraisalFrom.date.day : this.appraisalFrom.date.day;
    let _fromDate: string = this.appraisalFrom.date.year + '-' + _fromMonth + '-' + _fromDay + 'T12:00:00Z'
    this.appraisal.From = new Date(_fromDate);

    let _toMonth = this.appraisalTo.date.month.toString().length < 2 ? '0' + this.appraisalTo.date.month : this.appraisalTo.date.month;
    let _toDay = this.appraisalTo.date.day.toString().length < 2 ? '0' + this.appraisalTo.date.day : this.appraisalTo.date.day;
    let _toDate: string = this.appraisalTo.date.year + '-' + _toMonth + '-' + _toDay + 'T12:00:00Z'
    this.appraisal.To = new Date(_toDate);
    // End date problem

    this.appraisal.departmentEnName = JSON.parse(this.currentUser.departmentList).filter(c => c.Value == this.appraisal.departmentId)[0].Text;
    this._dataService.post('/api/appraisal/exportExcel', JSON.stringify(this.appraisal)).subscribe((response: any) => {
      window.open(SystemConstants.BASE_API + response);
      // window.location.href = this.baseFolder + response.Message;
      this._dataService.delete('/api/appraisal/deleteReportFile', 'reportPath', response).subscribe((response: Response) => { });
    }, error => this._handleErrorService.handleError(error));
  }

  uncheckGoal(name: string) {
    switch (name) {
      case 'goal1':
        this.appraisal.goal1 = 0; this.generateSubTotal2(); break;
      case 'goal2':
        this.appraisal.goal2 = 0; this.generateSubTotal2(); break;
      case 'goal3':
        this.appraisal.goal3 = 0; this.generateSubTotal2(); break;
      case 'goal4':
        this.appraisal.goal4 = 0; this.generateSubTotal2(); break;
      default: return;
    }

  }

  goalIsValid(): Boolean {
    let valid = true;
    if (this.appraisal.goal1 == 0 && this.appraisal.goal1Content) valid = false;
    else if (this.appraisal.goal2 == 0 && this.appraisal.goal2Content) valid = false;
    else if (this.appraisal.goal3 == 0 && this.appraisal.goal3Content) valid = false;
    else if (this.appraisal.goal4 == 0 && this.appraisal.goal4Content) valid = false;
    return valid;
  }
}


