import { Component, OnInit } from '@angular/core';

import { IMyDpOptions } from 'mydatepicker';

import { AuthenService } from '../../../../core/services/authen.service';
import { LoggedInUser } from '../../../../core/domain/loggedin.user';
import { DataService } from '../../../../core/services/data.service';
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
  statusId: string;
  loading: Boolean;
  public baseFolder: string = SystemConstants.BASE_API;

  appraisalFrom = {
    jsdate: ''
  };
  appraisalTo = {
    jsdate: ''
  };

  private myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
  };
  private today = new Date();
  // Initialized to specific date (09.10.2018).
  temporarydate = { date: { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() } };



  constructor(private _authenService: AuthenService, private _dataService: DataService, private _notificationService: NotificationService,
    private _utilityService: UtilityService
  ) {

    this.currentUser = _authenService.getLoggedInUser();

    this.departmentList = JSON.parse(this.currentUser.departmentList);

    this.categoryList = JSON.parse(this.currentUser.categoryList)

    this.appraisal = {
      associateName: this.currentUser.fullName,
      associateTitle: this.currentUser.userTitle,
      associateId: this.currentUser.userName,
      departmentId: this.currentUser.departmentId
    }
    // alert(JSON.stringify(this.currentUser.depart));
    // debugger 
    if (this.currentUser.userType == 'WK') {
      this.supervisoryToggle = true;
      this.leadershipToggle = true;
    }
    else if (this.currentUser.userType == 'SV') {
      this.leadershipToggle = true;
    }
  }

  ngOnInit() {
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

    this.appraisal.from = new Date(this.appraisalFrom.jsdate);
    this.appraisal.to = new Date(this.appraisalTo.jsdate);
    // End date problem

    // alert(JSON.stringify(this.appraisal));

    this.loading = true;
    this.appraisal.statusId = this.statusId;
    this._dataService.post('/api/appraisal/create', JSON.stringify(this.appraisal)).subscribe((response: any) => {
      if (this.statusId == 'N') this._notificationService.printSuccessMessage(MessageConstants.SAVE_DRAFT_SUCCESS);
      if (this.statusId == 'S') this._notificationService.printSuccessMessage(MessageConstants.SUBMIT_APPRAISAL_SUCCESS);
      this._utilityService.navigate('/main/appraisal');
    }, error => this._dataService.handleError(error));
  }

  // Generate conclusion
  subTotal1 = 0;
  subTotal2 = 0;
  conclusion = 0;

  customerDriven = 0;
  questForExcellence = 0;
  teamWork = 0;
  respectAndTrust = 0;
  enterprising = 0;
  communication = 0;
  dependability = 0;
  quantityOfWork = 0;
  qualityOfWork = 0;

  personalEfficiency = 0;
  workforceScheduling = 0;
  qualityManagement = 0;
  performanceManagement = 0;
  successionPlanning = 0;
  managingConflicts = 0;
  celebrateResults = 0;

  leadWithVision = 0;
  alignAndEngage = 0;
  talentMagnet = 0;

  goal1 = 0;
  goal2 = 0;
  goal3 = 0;
  goal4 = 0;

  generateConclusion(name: string, value: number) {
    // debugger;
    switch (name) {
      case 'customerDriven':
        this.customerDriven = value; break;
      case 'questForExcellence':
        this.questForExcellence = value; break;
      case 'teamWork':
        this.teamWork = value; break;
      case 'respectAndTrust':
        this.respectAndTrust = value; break;
      case 'enterprising':
        this.enterprising = value; break;
      case 'communication':
        this.communication = value; break;
      case 'dependability':
        this.dependability = value; break;
      case 'quantityOfWork':
        this.quantityOfWork = value; break;
      case 'qualityOfWork':
        this.qualityOfWork = value; break;

      case 'personalEfficiency':
        this.personalEfficiency = value; break;
      case 'workforceScheduling':
        this.workforceScheduling = value; break;
      case 'qualityManagement':
        this.qualityManagement = value; break;
      case 'performanceManagement':
        this.performanceManagement = value; break;
      case 'successionPlanning':
        this.successionPlanning = value; break;
      case 'managingConflicts':
        this.managingConflicts = value; break;
      case 'celebrateResults':
        this.celebrateResults = value; break;

      case 'leadWithVision':
        this.leadWithVision = value; break;
      case 'alignAndEngage':
        this.alignAndEngage = value; break;
      case 'talentMagnet':
        this.talentMagnet = value; break;

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
    let noCompetencies = 0;
    if (this.customerDriven > 0) noCompetencies++;
    if (this.questForExcellence > 0) noCompetencies++;
    if (this.teamWork > 0) noCompetencies++;
    if (this.respectAndTrust > 0) noCompetencies++;
    if (this.enterprising > 0) noCompetencies++;
    if (this.communication > 0) noCompetencies++;
    if (this.dependability > 0) noCompetencies++;
    if (this.quantityOfWork > 0) noCompetencies++;
    if (this.qualityOfWork > 0) noCompetencies++;

    if (this.personalEfficiency > 0) noCompetencies++;
    if (this.workforceScheduling > 0) noCompetencies++;
    if (this.qualityManagement > 0) noCompetencies++;
    if (this.performanceManagement > 0) noCompetencies++;
    if (this.successionPlanning > 0) noCompetencies++;
    if (this.managingConflicts > 0) noCompetencies++;
    if (this.celebrateResults > 0) noCompetencies++;
    if (this.leadWithVision > 0) noCompetencies++;
    if (this.alignAndEngage > 0) noCompetencies++;
    if (this.talentMagnet > 0) noCompetencies++;

    this.subTotal1 = (noCompetencies == 0) ? 0 : (
      this.customerDriven +
      this.questForExcellence +
      this.teamWork +
      this.respectAndTrust +
      this.enterprising +
      this.communication +
      this.dependability +
      this.quantityOfWork +
      this.qualityOfWork +

      this.personalEfficiency +
      this.workforceScheduling +
      this.qualityManagement +
      this.performanceManagement +
      this.successionPlanning +
      this.managingConflicts +
      this.celebrateResults +

      this.leadWithVision +
      this.alignAndEngage +
      this.talentMagnet)
      / noCompetencies;

    let noGoals = 0;
    if (this.goal1 > 0) noGoals++;
    if (this.goal2 > 0) noGoals++;
    if (this.goal3 > 0) noGoals++;
    if (this.goal4 > 0) noGoals++;
    this.subTotal2 = (noGoals == 0) ? 0 : (this.goal1 + this.goal2 + this.goal3 + this.goal4) / noGoals;

    this.conclusion = this.subTotal1 * 0.3 + this.subTotal2 * 0.7
  }

  exportExcel(valid: Boolean) {
    if (!valid) return;
    // Date problem
    let _appraisalMonth = this.temporarydate.date.month.toString().length < 2 ? '0' + this.temporarydate.date.month : this.temporarydate.date.month;
    let _appraisalDay = this.temporarydate.date.day.toString().length < 2 ? '0' + this.temporarydate.date.day : this.temporarydate.date.day;
    let _reviewDate: string = this.temporarydate.date.year + '-' + _appraisalMonth + '-' + _appraisalDay + 'T12:00:00Z'
    this.appraisal.reviewDate = new Date(_reviewDate);

    this.appraisal.from = new Date(this.appraisalFrom.jsdate);
    this.appraisal.to = new Date(this.appraisalTo.jsdate);
    // End date problem

    this.appraisal.departmentEnName = JSON.parse(this.currentUser.departmentList).filter(c => c.Value == this.appraisal.departmentId)[0].Text;
    this._dataService.post('/api/appraisal/exportExcel', JSON.stringify(this.appraisal)).subscribe((response: any) => {
      window.open(this.baseFolder + response.Message);
      // window.location.href = this.baseFolder + response.Message;
      this._dataService.delete('/api/appraisal/deleteReportFile', 'reportPath', response.Message).subscribe((response: Response) => { });
    }, error => this._dataService.handleError(error));
  }
}


