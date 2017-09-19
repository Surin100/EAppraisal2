import { Component, OnInit } from '@angular/core';

import { IMyDpOptions } from 'mydatepicker';

import { AuthenService } from '../../../../core/services/authen.service';
import { LoggedInUser } from '../../../../core/domain/loggedin.user';
import { DataService } from '../../../../core/services/data.service';
import { HandleErrorService } from '../../../../core/services/handle-error.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { MessageConstants } from '../../../../core/common/message.constants';
import { ArrayConstants } from '../../../../core/common/array.constants';
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
  baseFolder: string = SystemConstants.BASE_API;
  partAShow: string[];
  partBShow: string[];
  partCShow: string[];


  constructor(private _authenService: AuthenService, private _dataService: DataService, private _notificationService: NotificationService,
    private _utilityService: UtilityService, private _handleErrorService: HandleErrorService
  ) {

    this.currentUser = _authenService.getLoggedInUser();
    // console.log(this.currentUser);

    this.departmentList = JSON.parse(this.currentUser.departmentList);

    this.categoryList = JSON.parse(this.currentUser.categoryList);

    this.appraisal = {
      associateName: this.currentUser.fullName,
      associateTitle: this.currentUser.jobTitle,
      associateId: this.currentUser.userName,
      departmentId: this.currentUser.departmentId,
      reviewerName: this.currentUser.reviewerName,
      reviewerTitle: this.currentUser.reviewerTitle
    }
    // alert(JSON.stringify(this.currentUser.depart));
    // debugger
    this.partAShow = ArrayConstants.NON_SUPERVISOR_LEVEL;
    this.partBShow = ArrayConstants.SUPERVISOR_LEVEL;
    this.partCShow = ArrayConstants.LEADER_LEVEL;
    if (this.partAShow.includes(this.currentUser.employeeLvId)) {
      this.supervisoryToggle = true;
      this.leadershipToggle = true;
    }
    else if (this.partBShow.includes(this.currentUser.employeeLvId)) {
      this.leadershipToggle = true;
    }
  }

  ngOnInit() {
    this.appraisal.subTotal1 = 0;
    this.appraisal.subTotal2 = 0;
    this.appraisal.conclusion = 0;

    // this.appraisal.goal1 = 0;
    // this.appraisal.goal2 = 0;
    // this.appraisal.goal3 = 0;
    // this.appraisal.goal4 = 0;
  }

  private myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
  };
  private today = new Date();
  // Initialized to specific date (09.10.2018).
  temporarydate = { date: { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() } };

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

    let customerDriven = this.appraisal.customerDriven ? this.appraisal.customerDriven : 0;
    let questForExcellence = this.appraisal.questForExcellence ? this.appraisal.questForExcellence : 0;
    let teamWork = this.appraisal.teamWork ? this.appraisal.teamWork : 0;
    let respectAndTrust = this.appraisal.respectAndTrust ? this.appraisal.respectAndTrust : 0;
    let enterprising = this.appraisal.enterprising ? this.appraisal.enterprising : 0;
    let communication = this.appraisal.communication ? this.appraisal.communication : 0;
    let dependability = this.appraisal.dependability ? this.appraisal.dependability : 0;
    let quantityOfWork = this.appraisal.quantityOfWork ? this.appraisal.quantityOfWork : 0;
    let qualityOfWork = this.appraisal.qualityOfWork ? this.appraisal.qualityOfWork : 0;

    let personalEfficiency = this.appraisal.personalEfficiency ? this.appraisal.personalEfficiency : 0;
    let workforceScheduling = this.appraisal.workforceScheduling ? this.appraisal.workforceScheduling : 0;
    let qualityManagement = this.appraisal.qualityManagement ? this.appraisal.qualityManagement : 0;
    let performanceManagement = this.appraisal.performanceManagement ? this.appraisal.performanceManagement : 0;
    let successionPlanning = this.appraisal.successionPlanning ? this.appraisal.successionPlanning : 0;
    let managingConflicts = this.appraisal.managingConflicts ? this.appraisal.managingConflicts : 0;
    let celebrateResults = this.appraisal.celebrateResults ? this.appraisal.celebrateResults : 0;

    let leadWithVision = this.appraisal.leadWithVision ? this.appraisal.leadWithVision : 0;
    let alignAndEngage = this.appraisal.alignAndEngage ? this.appraisal.alignAndEngage : 0;
    let talentMagnet = this.appraisal.talentMagnet ? this.appraisal.talentMagnet : 0;

    this.appraisal.subTotal1 = (noCompetencies == 0) ? 0 : (
      customerDriven +
        questForExcellence +
        teamWork +
        respectAndTrust +
        enterprising +
        communication +
        dependability +
        quantityOfWork +
        qualityOfWork +

        personalEfficiency +
        workforceScheduling +
        qualityManagement +
        performanceManagement +
        successionPlanning +
        managingConflicts +
        celebrateResults + 

        leadWithVision + 
        alignAndEngage +
        talentMagnet)
      / noCompetencies;

    this.appraisal.conclusion = this.appraisal.subTotal1 * 0.3 + this.appraisal.subTotal2 * 0.7
  }

  generateSubTotal2() {
    let noGoals = 0;
    if (this.appraisal.goal1 > 0) noGoals++;
    if (this.appraisal.goal2 > 0) noGoals++;
    if (this.appraisal.goal3 > 0) noGoals++;
    if (this.appraisal.goal4 > 0) noGoals++;

    let goal1 = this.appraisal.goal1? this.appraisal.goal1 : 0;
    let goal2 = this.appraisal.goal2? this.appraisal.goal2 : 0;
    let goal3 = this.appraisal.goal3? this.appraisal.goal3 : 0;
    let goal4 = this.appraisal.goal4? this.appraisal.goal4 : 0;

    this.appraisal.subTotal2 = (noGoals == 0) ? 0 : (
      goal1 + 
      goal2 + 
      goal3 + 
      goal4) / noGoals;

    this.appraisal.conclusion = this.appraisal.subTotal1 * 0.3 + this.appraisal.subTotal2 * 0.7
  }

  // End of Generate conclusion

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

    let exportExcelPromise = new Promise((Resolve, Reject) => {
      this._dataService.post('/api/appraisal/exportExcel', JSON.stringify(this.appraisal)).subscribe((response: any) => {
        window.open(SystemConstants.BASE_API + response);
        Resolve(response);
      }, error => this._handleErrorService.handleError(error));
    });
    exportExcelPromise.then((element) => this._dataService.delete('/api/Report/deleteReportFile', 'reportPath', element.toString()).subscribe((response: Response) => { }));
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


