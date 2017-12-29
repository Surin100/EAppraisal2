import { Component, OnInit, ViewChild, NgZone } from '@angular/core';

import { IMyDpOptions } from 'mydatepicker';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AuthenService } from '../../../core/services/authen.service';
import { SignalrService } from '../../../core/services/signalr.service';
import { DataService } from '../../../core/services/data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { HandleErrorService } from '../../../core/services/handle-error.service';
import { UtilityService } from '../../../core/services/utility.service';
import { LoggedInUser } from '../../../core/domain/loggedin.user';
import { MessageConstants } from '../../../core/common/message.constants';
import { UrlConstants } from '../../../core/common/url.constants';
import { ArrayConstants } from '../../../core/common/array.constants';
import {SystemConstants} from '../../../core/common/system.constants';

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.css']
})
export class ApprovalComponent implements OnInit {
  @ViewChild('approveAppraisalModal') public approveAppraisalModal: ModalDirective;
  approveLoading: Boolean = false;
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRow: number;
  filter: string = '';
  maxSize: number = 10;
  appraisals: any[];
  // appraisal: any;
  appraisalApproval: any;
  currentUser: LoggedInUser;
  departmentList = [];
  categoryList = [];
  temporarydate;
  supervisoryChevron = false;
  supervisoryToggle = false;
  leadershipChevron = false;
  leadershipToggle = false;
  partAShow: string[];
  partBShow: string[];
  partCShow: string[];
  appraisalApprovalFrom: string;
  appraisalApprovalTo: string;
  exportIndex: any = {};

  canSendMessage: Boolean;
  
  constructor(private _authenService: AuthenService, private _dataService: DataService, private _handleErrorService: HandleErrorService,
    private _utilityService: UtilityService, private _notificationService: NotificationService, private _signalrService: SignalrService,
    private _ngZone: NgZone
  ) {
    
    // $.connection.hub.logging = true;
  }

  ngOnInit() {
    
    this.loadData();
    // this.subscribeToEvents();
    // this.canSendMessage = this._signalrService.connectionEstablished;
    this.currentUser = this._authenService.getLoggedInUser();
    this.categoryList = JSON.parse(this.currentUser.categoryList);

  }


  subscribeToEvents(): void{
    this._signalrService.startConnection();
    
    this._signalrService.registerOnServerEvents();
    //if connection exists it can call of method
    this._signalrService.connectionEstablished.subscribe((data:boolean)=>{
      this.canSendMessage = data;
      // console.log(this.canSendMessage);
    }); 

    
    this._signalrService.updateApprovalList.subscribe((message:any)=>{

      this._ngZone.run(() => {
        this.loadData();
        console.log(message);
      });
    });
  }

  private myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
  };

  loadData() {
    this._dataService.get('/api/appraisal/GetNeedYourAppraisalApprovalListPaging?pageIndex=' + this.pageIndex + '&pagesize=' + this.pageSize + '&filter=' + this.filter)
      .subscribe((response: any) => {
        this.appraisals = response.Items;
        this.appraisals.forEach(element => {
          element.StatusName = JSON.parse(this.currentUser.statusList).filter(a => a.Value == element.StatusId)[0].Text;
        });
        // console.log(this.appraisals);
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.totalRow = response.TotalRow;
      }, error => this._handleErrorService.handleError(error));
  }

  pageChanged(event: any): void {
    // debugger
    this.pageIndex = event.page;
    this.loadData();
  }

  loadAppraisal(Id: any, StatusId: String) {
    this.supervisoryToggle = false;
    this.leadershipToggle = false;
    // console.log(Id + StatusId);
    if (StatusId === 'S') {
      this._dataService.get('/api/appraisal/getAppraisal/' + Id).subscribe((response: any) => {
        this.appraisalApproval = {};
        this.appraisalApproval = response;
        // console.log(this.appraisalApproval);
        this.appraisalApproval.AppraisalId = response.Id;
        this.appraisalApproval.AppraiseeId = response.UserId;
        this.appraisalApproval.ReviewerName = this.currentUser.fullName;
        this.appraisalApproval.ReviewerTitle = this.currentUser.jobTitle;
        this.appraisalApproval.departmentEnName = JSON.parse(this.currentUser.departmentList).filter(a => a.Value == this.appraisalApproval.DepartmentId)[0].Text;
        this.appraisalApproval.categoryName = JSON.parse(this.currentUser.categoryList).filter(a => a.Value == this.appraisalApproval.CategoryId)[0].Text;
        let fromDate = new Date(this.appraisalApproval.From);
        this.appraisalApprovalFrom = fromDate.getDate() + '/' + (fromDate.getMonth() + 1) + '/' + fromDate.getFullYear();
        let toDate = new Date(this.appraisalApproval.To);
        this.appraisalApprovalTo = toDate.getDate() + '/' + (toDate.getMonth() + 1) + '/' + toDate.getFullYear();
        let reviewDate = new Date(this.appraisalApproval.ReviewDate)
        // console.log(this.appraisalApproval);
        this.temporarydate = { date: { year: reviewDate.getFullYear(), month: reviewDate.getMonth() + 1, day: reviewDate.getDate() } };

        this.partAShow = ArrayConstants.NON_SUPERVISOR_LEVEL;
        this.partBShow = ArrayConstants.SUPERVISOR_LEVEL;
        this.partCShow = ArrayConstants.LEADER_LEVEL;
        // console.log(this.appraisalApproval);
        if (this.partAShow.includes(this.appraisalApproval.EmployeeLvId)) {
          this.supervisoryToggle = true;
          this.leadershipToggle = true;
        }
        else if (this.partBShow.includes(this.appraisalApproval.EmployeeLvId)) {
          this.leadershipToggle = true;
        }
      }, error => this._handleErrorService.handleError(error));
    }
    else {
      this._dataService.get('/api/AppraisalApproval/getViewAppraisalApproval/?_appraisalId=' + Id + '&statusId=' + StatusId).subscribe((response: any) => {
        this.appraisalApproval = {};
        this.appraisalApproval = response;
        // console.log(this.appraisalApproval);
        this.appraisalApproval.AppraiseeId = response.UserId;
        this.appraisalApproval.departmentEnName = JSON.parse(this.currentUser.departmentList).filter(a => a.Value == this.appraisalApproval.DepartmentId)[0].Text;
        this.appraisalApproval.categoryName = JSON.parse(this.currentUser.categoryList).filter(a => a.Value == this.appraisalApproval.CategoryId)[0].Text;
        let fromDate = new Date(this.appraisalApproval.From);
        this.appraisalApprovalFrom = fromDate.getDate() + '/' + (fromDate.getMonth() + 1) + '/' + fromDate.getFullYear();
        let toDate = new Date(this.appraisalApproval.To);
        this.appraisalApprovalTo = toDate.getDate() + '/' + (toDate.getMonth() + 1) + '/' + toDate.getFullYear();
        let reviewDate = new Date(this.appraisalApproval.ReviewDate)
        // console.log(this.appraisalApproval);
        this.temporarydate = { date: { year: reviewDate.getFullYear(), month: reviewDate.getMonth() + 1, day: reviewDate.getDate() } };

        this.partAShow = ArrayConstants.NON_SUPERVISOR_LEVEL;
        this.partBShow = ArrayConstants.SUPERVISOR_LEVEL;
        this.partCShow = ArrayConstants.LEADER_LEVEL;
        // console.log(this.appraisalApproval.EmployeeLvId);
        if (this.partAShow.includes(this.appraisalApproval.EmployeeLvId)) {
          this.supervisoryToggle = true;
          this.leadershipToggle = true;
        }
        else if (this.partBShow.includes(this.appraisalApproval.EmployeeLvId)) {
          this.leadershipToggle = true;
        }
      }, error => this._handleErrorService.handleError(error));
    }

  }

  showApproveAppraisalModal(appraisalId: number, appraisalStatusId: String) {
    this.loadAppraisal(appraisalId, appraisalStatusId);
    this.approveAppraisalModal.show();

  }

  approveAppraisal(valid: Boolean) {
    if (!valid || this.appraisalApproval.AppraisalId == undefined) return;

    if (this.appraisalApproval.statusId == 'V') {
      this._notificationService.printConfirmationDialog(MessageConstants.CONFIRM_REJECT_APPRAISAL_MSG, () => {
        this.approveLoading = true;
        this.saveApproval();
      });
    } else {
      this.approveLoading = true;
      this.saveApproval();
    }
  }

  saveApproval() {
    // this.appraisalApproval.AppraisalId = this.appraisal.Id;
    // this.appraisalApproval.AppraiseeId = this.appraisal.UserId;
    // Date problem
    let _appraisalMonth = this.temporarydate.date.month.toString().length < 2 ? '0' + this.temporarydate.date.month : this.temporarydate.date.month;
    let _appraisalDay = this.temporarydate.date.day.toString().length < 2 ? '0' + this.temporarydate.date.day : this.temporarydate.date.day;
    let _reviewDate: string = this.temporarydate.date.year + '-' + _appraisalMonth + '-' + _appraisalDay + 'T15:00:00Z'
    this.appraisalApproval.reviewDate = new Date(_reviewDate);
    // End Date problem

    this._dataService.post('/api/AppraisalApproval/SaveAppraisalApproval', this.appraisalApproval).subscribe((response: any) => {
      if (this.appraisalApproval.statusId == 'V') {
        this._notificationService.printSuccessMessage(MessageConstants.REJECT_SUCCESS);
      } else {
        this._notificationService.printSuccessMessage(MessageConstants.APPROVE_SUCCESS);
      }
      this.approveLoading = false;
      this.approveAppraisalModal.hide();
      this.loadData();
    }, error => {
      // alert(JSON.stringify(error));
      if (JSON.parse(error._body).Message == "Approve succeeded but we cannot send mail.") {
        this._notificationService.printSuccessMessage("Approve succeeded but we cannot send mail.");
        this.loadData();
        this.approveAppraisalModal.hide();
      }
      else if (JSON.parse(error._body).Message == "Reject succeeded but we cannot send mail.") {
        this._notificationService.printSuccessMessage("Reject succeeded but we cannot send mail.");
        this.loadData();
        this.approveAppraisalModal.hide();
      }
      else {
        this._handleErrorService.handleError(error);
      }
      this.approveLoading = false;
    });
  }

  exportExcel(valid: Boolean) {
    if(valid === false) return;
    //  alert(JSON.stringify(this.appraisalFrom));
    // Date problem
    let _appraisalMonth = this.temporarydate.date.month.toString().length < 2 ? '0' + this.temporarydate.date.month : this.temporarydate.date.month;
    let _appraisalDay = this.temporarydate.date.day.toString().length < 2 ? '0' + this.temporarydate.date.day : this.temporarydate.date.day;
    let _reviewDate: string = this.temporarydate.date.year + '-' + _appraisalMonth + '-' + _appraisalDay + 'T12:00:00Z'
    this.appraisalApproval.reviewDate = new Date(_reviewDate);

    // let _fromMonth = this.appraisalFrom.date.month.toString().length < 2 ? '0' + this.appraisalFrom.date.month : this.appraisalFrom.date.month;
    // let _fromDay = this.appraisalFrom.date.day.toString().length < 2 ? '0' + this.appraisalFrom.date.day : this.appraisalFrom.date.day;
    // let _fromDate: string = this.appraisalFrom.date.year + '-' + _fromMonth + '-' + _fromDay + 'T12:00:00Z'
    // this.appraisal.From = new Date(_fromDate);

    // let _toMonth = this.appraisalTo.date.month.toString().length < 2 ? '0' + this.appraisalTo.date.month : this.appraisalTo.date.month;
    // let _toDay = this.appraisalTo.date.day.toString().length < 2 ? '0' + this.appraisalTo.date.day : this.appraisalTo.date.day;
    // let _toDate: string = this.appraisalTo.date.year + '-' + _toMonth + '-' + _toDay + 'T12:00:00Z'
    // this.appraisal.To = new Date(_toDate);
    // End date problem

    // this.appraisal.departmentEnName = JSON.parse(this.currentUser.departmentList).filter(c => c.Value == this.appraisal.departmentId)[0].Text;

    let exportExcelPromise = new Promise((Resolve, Reject) => {
      this._dataService.post('/api/appraisal/exportExcel', JSON.stringify(this.appraisalApproval)).subscribe((response: any) => {
        window.open(SystemConstants.BASE_API + response);
        // Resolve(response);
        setTimeout(()=> Resolve(response),300000);
      }, error => this._handleErrorService.handleError(error));
    });
    exportExcelPromise.then((element) => this._dataService.delete('/api/Report/deleteReportFile', 'reportPath', element.toString()).subscribe((response: Response) => { }));
  }

  supervisoryClick() {
    this.supervisoryChevron = !this.supervisoryChevron;
  }

  leadershipClick() {
    this.leadershipChevron = !this.leadershipChevron;
  }

  // Generate conclusion

  generateSubTotal1() {
    let noCompetencies = 0;
    if (this.appraisalApproval.CustomerDriven > 0) noCompetencies++;
    if (this.appraisalApproval.QuestForExcellence > 0) noCompetencies++;
    if (this.appraisalApproval.TeamWork > 0) noCompetencies++;
    if (this.appraisalApproval.RespectAndTrust > 0) noCompetencies++;
    if (this.appraisalApproval.Enterprising > 0) noCompetencies++;
    if (this.appraisalApproval.Communication > 0) noCompetencies++;
    if (this.appraisalApproval.Dependability > 0) noCompetencies++;
    if (this.appraisalApproval.QuantityOfWork > 0) noCompetencies++;
    if (this.appraisalApproval.QualityOfWork > 0) noCompetencies++;

    if (this.appraisalApproval.PersonalEfficiency > 0) noCompetencies++;
    if (this.appraisalApproval.WorkforceScheduling > 0) noCompetencies++;
    if (this.appraisalApproval.QualityManagement > 0) noCompetencies++;
    if (this.appraisalApproval.PerformanceManagement > 0) noCompetencies++;
    if (this.appraisalApproval.SuccessionPlanning > 0) noCompetencies++;
    if (this.appraisalApproval.ManagingConflicts > 0) noCompetencies++;
    if (this.appraisalApproval.CelebrateResults > 0) noCompetencies++;
    if (this.appraisalApproval.LeadWithVision > 0) noCompetencies++;
    if (this.appraisalApproval.AlignAndEngage > 0) noCompetencies++;
    if (this.appraisalApproval.TalentMagnet > 0) noCompetencies++;

    this.appraisalApproval.SubTotal1 = (noCompetencies == 0) ? 0 : (
      this.appraisalApproval.CustomerDriven +
      this.appraisalApproval.QuestForExcellence +
      this.appraisalApproval.TeamWork +
      this.appraisalApproval.RespectAndTrust +
      this.appraisalApproval.Enterprising +
      this.appraisalApproval.Communication +
      this.appraisalApproval.Dependability +
      this.appraisalApproval.QuantityOfWork +
      this.appraisalApproval.QualityOfWork +

      this.appraisalApproval.PersonalEfficiency +
      this.appraisalApproval.WorkforceScheduling +
      this.appraisalApproval.QualityManagement +
      this.appraisalApproval.PerformanceManagement +
      this.appraisalApproval.SuccessionPlanning +
      this.appraisalApproval.ManagingConflicts +
      this.appraisalApproval.CelebrateResults +

      this.appraisalApproval.LeadWithVision +
      this.appraisalApproval.AlignAndEngage +
      this.appraisalApproval.TalentMagnet)
      / noCompetencies;

    this.appraisalApproval.Conclusion = this.appraisalApproval.SubTotal2 > 0? this.appraisalApproval.SubTotal1 * 0.7 + this.appraisalApproval.SubTotal2 * 0.3 : this.appraisalApproval.SubTotal1;
  }

  generateSubTotal2() {
    let noGoals = 0;
    if (this.appraisalApproval.Goal1 > 0) noGoals++;
    if (this.appraisalApproval.Goal2 > 0) noGoals++;
    if (this.appraisalApproval.Goal3 > 0) noGoals++;
    if (this.appraisalApproval.Goal4 > 0) noGoals++;
    this.appraisalApproval.SubTotal2 = (noGoals == 0) ? 0 : (this.appraisalApproval.Goal1 + this.appraisalApproval.Goal2 + this.appraisalApproval.Goal3 + this.appraisalApproval.Goal4) / noGoals;

    this.appraisalApproval.Conclusion = this.appraisalApproval.SubTotal2 > 0? this.appraisalApproval.SubTotal1 * 0.7 + this.appraisalApproval.SubTotal2 * 0.3 : this.appraisalApproval.SubTotal1;
  }

  // End of Generate conclusion

  uncheckGoal(name: string) {
    switch (name) {
      case 'goal1':
        this.appraisalApproval.Goal1 = 0; this.generateSubTotal2(); break;
      case 'goal2':
        this.appraisalApproval.Goal2 = 0; this.generateSubTotal2(); break;
      case 'goal3':
        this.appraisalApproval.Goal3 = 0; this.generateSubTotal2(); break;
      case 'goal4':
        this.appraisalApproval.Goal4 = 0; this.generateSubTotal2(); break;
      default: return;
    }
  }

  exportApprovalIndexToExcel(){
    let exportExcelPromise = new Promise((Resolve, Reject) => {
      this._dataService.post('/api/Appraisal/ApprovalListToExcel', JSON.stringify(this.exportIndex)).subscribe((response: any)=>{
        window.open(SystemConstants.BASE_API + response);
        // Resolve(response);
        setTimeout(()=> Resolve(response),300000);
    }, error => this._handleErrorService.handleError(error));
  });
  exportExcelPromise.then((element) => this._dataService.delete('/api/Report/deleteReportFile', 'reportPath', element.toString()).subscribe((response: Response) => { }));
  }
}



