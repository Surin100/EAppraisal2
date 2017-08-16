import { Component, OnInit, ViewChild } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { IMyDpOptions } from 'mydatepicker';

import { HandleErrorService } from '../../../../core/services/handle-error.service';
import { DataService } from '../../../../core/services/data.service';
import { AuthenService } from '../../../../core/services/authen.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { MessageConstants } from '../../../../core/common/message.constants';
import { LoggedInUser } from '../../../../core/domain/loggedin.user';
import { SystemConstants } from '../../../../core/common/system.constants';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  @ViewChild('modifyAppraisalModal') public modifyAppraisalModal: ModalDirective;
  @ViewChild('viewAppraisalModal') public viewAppraisalModal: ModalDirective;
  supervisoryChevron = false;
  supervisoryToggle = false;
  leadershipChevron = false;
  leadershipToggle = false;
  updateAppraisalLoading = false;
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRow: number;
  filter: string = '';
  maxSize: number = 10;
  appraisals: any[];
  appraisal: any = {};
  deleteAppraisalLoading: Boolean = false;
  currentUser: LoggedInUser;
  appraisalfrom: any;
  appraisalto: any;
  temporarydate: any;
  departmentList = [];
  categoryList = [];
  viewAppraisal: any;

  constructor(private _handleErrorService: HandleErrorService, private _dataService: DataService, private _notificationService: NotificationService,
    private _authenService: AuthenService) {
    this.currentUser = this._authenService.getLoggedInUser();
  }

  ngOnInit() {

    this.departmentList = JSON.parse(this.currentUser.departmentList);
    this.categoryList = JSON.parse(this.currentUser.categoryList)
    if (this.currentUser.employeeLvId == 'WK') {
      this.supervisoryToggle = true;
      this.leadershipToggle = true;
    }
    else if (this.currentUser.employeeLvId == 'SV') {
      this.leadershipToggle = true;
    }
    this.loadData();
  }

  private myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
  };

  loadData() {
    this._dataService.get('/api/appraisal/getlistpaging?pageIndex=' + this.pageIndex + '&pagesize=' + this.pageSize + '&filter=' + this.filter)
      .subscribe((response: any) => {
        this.appraisals = response.Items;
        this.appraisals.forEach(element => {
          element.statusName = JSON.parse(this.currentUser.statusList).filter(s => s.Value == element.StatusId)[0].Text;
          element.categoryName = JSON.parse(this.currentUser.categoryList).filter(s => s.Value == element.CategoryId)[0].Text;
        });
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.totalRow = response.TotalRow;
        console.log(this.appraisals);
      }, error => this._handleErrorService.handleError(error));
  }

  pageChanged(event: any): void {
    // debugger
    this.pageIndex = event.page;
    this.loadData();
  }

  deleteAppraisal(id: string) {
    this.deleteAppraisalLoading = true;
    this._notificationService.printConfirmationDialog(MessageConstants.CONFIRM_DELETE_MSG, () => {
      this.deleteAppraisalConfirm(id);
    });

  }

  deleteAppraisalConfirm(id: string) {
    this._dataService.delete('/api/appraisal/delete', 'id', id).subscribe((response: any) => {
      this.loadData();
      this._notificationService.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
      this.deleteAppraisalLoading = false;
    }, error => {
      this._handleErrorService.handleError(error);
      this.deleteAppraisalLoading = false;
    });
  }

  showModifyAppraisalModal(Id) {
    this.loadAppraisal(Id);
    this.modifyAppraisalModal.show();
  }

  supervisoryClick() {
    this.supervisoryChevron = !this.supervisoryChevron;
  }
  leadershipClick() {
    this.leadershipChevron = !this.leadershipChevron;
  }

  loadAppraisal(Id) {
    this._dataService.get('/api/appraisal/getAppraisal/' + Id).subscribe((response: any) => {
      this.appraisal = {};
      this.appraisal = response;
      // console.log(this.appraisal);
      this.appraisal.departmentEnName = JSON.parse(this.currentUser.departmentList).filter(a => a.Value == response.DepartmentId)[0].Text;
      this.appraisal.categoryName = JSON.parse(this.currentUser.categoryList).filter(a => a.Value == response.CategoryId)[0].Text;
      let fromDate = new Date(response.From);
      this.appraisalfrom = { date: { year: fromDate.getFullYear(), month: fromDate.getMonth() + 1, day: fromDate.getDate() } };
      let toDate = new Date(response.To);
      this.appraisalto = { date: { year: toDate.getFullYear(), month: toDate.getMonth() + 1, day: toDate.getDate() } };
      let reviewDate = new Date(response.ReviewDate)
      this.temporarydate = { date: { year: reviewDate.getFullYear(), month: reviewDate.getMonth() + 1, day: reviewDate.getDate() } };

    }, error => this._handleErrorService.handleError(error));
  }

  // Generate conclusion
  generateSubTotal1() {
    let noCompetencies = 0;
    if (this.appraisal.CustomerDriven > 0) noCompetencies++;
    if (this.appraisal.QuestForExcellence > 0) noCompetencies++;
    if (this.appraisal.TeamWork > 0) noCompetencies++;
    if (this.appraisal.RespectAndTrust > 0) noCompetencies++;
    if (this.appraisal.Enterprising > 0) noCompetencies++;
    if (this.appraisal.Communication > 0) noCompetencies++;
    if (this.appraisal.Dependability > 0) noCompetencies++;
    if (this.appraisal.QuantityOfWork > 0) noCompetencies++;
    if (this.appraisal.QualityOfWork > 0) noCompetencies++;

    if (this.appraisal.PersonalEfficiency > 0) noCompetencies++;
    if (this.appraisal.WorkforceScheduling > 0) noCompetencies++;
    if (this.appraisal.QualityManagement > 0) noCompetencies++;
    if (this.appraisal.PerformanceManagement > 0) noCompetencies++;
    if (this.appraisal.SuccessionPlanning > 0) noCompetencies++;
    if (this.appraisal.ManagingConflicts > 0) noCompetencies++;
    if (this.appraisal.CelebrateResults > 0) noCompetencies++;
    if (this.appraisal.LeadWithVision > 0) noCompetencies++;
    if (this.appraisal.AlignAndEngage > 0) noCompetencies++;
    if (this.appraisal.TalentMagnet > 0) noCompetencies++;

    this.appraisal.SubTotal1 = (noCompetencies == 0) ? 0 : (
      this.appraisal.CustomerDriven +
      this.appraisal.QuestForExcellence +
      this.appraisal.TeamWork +
      this.appraisal.RespectAndTrust +
      this.appraisal.Enterprising +
      this.appraisal.Communication +
      this.appraisal.Dependability +
      this.appraisal.QuantityOfWork +
      this.appraisal.QualityOfWork +

      this.appraisal.PersonalEfficiency +
      this.appraisal.WorkforceScheduling +
      this.appraisal.QualityManagement +
      this.appraisal.PerformanceManagement +
      this.appraisal.SuccessionPlanning +
      this.appraisal.ManagingConflicts +
      this.appraisal.CelebrateResults +

      this.appraisal.LeadWithVision +
      this.appraisal.AlignAndEngage +
      this.appraisal.TalentMagnet)
      / noCompetencies;
    this.appraisal.Conclusion = this.appraisal.SubTotal1 * 0.3 + this.appraisal.SubTotal2 * 0.7
  }

  generateSubTotal2() {
    let noGoals = 0;
    if (this.appraisal.Goal1 > 0) noGoals++;
    if (this.appraisal.Goal2 > 0) noGoals++;
    if (this.appraisal.Goal3 > 0) noGoals++;
    if (this.appraisal.Goal4 > 0) noGoals++;
    this.appraisal.SubTotal2 = (noGoals == 0) ? 0 : (this.appraisal.Goal1 + this.appraisal.Goal2 + this.appraisal.Goal3 + this.appraisal.Goal4) / noGoals;
    this.appraisal.Conclusion = this.appraisal.SubTotal1 * 0.3 + this.appraisal.SubTotal2 * 0.7
  }

  uncheckGoal(name: string) {
    switch (name) {
      case 'goal1':
        this.appraisal.Goal1 = 0; this.generateSubTotal2(); break;
      case 'goal2':
        this.appraisal.Goal2 = 0; this.generateSubTotal2(); break;
      case 'goal3':
        this.appraisal.Goal3 = 0; this.generateSubTotal2(); break;
      case 'goal4':
        this.appraisal.Goal4 = 0; this.generateSubTotal2(); break;
      default: return;
    }

  }
  // End of generate Conclusion

  goalIsValid(): Boolean {
    let valid = true;
    if (this.appraisal.Goal1 == 0 && this.appraisal.Goal1Content) valid = false;
    else if (this.appraisal.Goal2 == 0 && this.appraisal.Goal2Content) valid = false;
    else if (this.appraisal.Goal3 == 0 && this.appraisal.Goal3Content) valid = false;
    else if (this.appraisal.Goal4 == 0 && this.appraisal.Goal4Content) valid = false;
    return valid;
  }

  updateAppraisal(valid: Boolean) {
    if (!valid) return;
    // Date problem
    let _reviewMonth = this.temporarydate.date.month.toString().length < 2 ? '0' + this.temporarydate.date.month : this.temporarydate.date.month;
    let _reviewDay = this.temporarydate.date.day.toString().length < 2 ? '0' + this.temporarydate.date.day : this.temporarydate.date.day;
    let _reviewDate: string = this.temporarydate.date.year + '-' + _reviewMonth + '-' + _reviewDay + 'T12:00:00Z'
    this.appraisal.ReviewDate = new Date(_reviewDate);

    let _fromMonth = this.appraisalfrom.date.month.toString().length < 2 ? '0' + this.appraisalfrom.date.month : this.appraisalfrom.date.month;
    let _fromDay = this.appraisalfrom.date.day.toString().length < 2 ? '0' + this.appraisalfrom.date.day : this.appraisalfrom.date.day;
    let _fromDate: string = this.appraisalfrom.date.year + '-' + _fromMonth + '-' + _fromDay + 'T12:00:00Z'
    this.appraisal.From = new Date(_fromDate);

    let _toMonth = this.appraisalto.date.month.toString().length < 2 ? '0' + this.appraisalto.date.month : this.appraisalto.date.month;
    let _toDay = this.appraisalto.date.day.toString().length < 2 ? '0' + this.appraisalto.date.day : this.appraisalto.date.day;
    let _toDate: string = this.appraisalto.date.year + '-' + _toMonth + '-' + _toDay + 'T12:00:00Z'
    this.appraisal.To = new Date(_toDate);
    // End date problem

    this.updateAppraisalLoading = true;
    this._dataService.put('/api/appraisal/update', this.appraisal).subscribe((response: any) => {
      if (this.appraisal.statusId == 'N') this._notificationService.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
      if (this.appraisal.statusId == 'S') this._notificationService.printSuccessMessage(MessageConstants.SUBMIT_APPRAISAL_SUCCESS);
      this.loadData();
      this.updateAppraisalLoading = false;
      this.modifyAppraisalModal.hide();
    }, error => {
      if (JSON.parse(error._body).Message == "Your appraisal has been submitted but we cannot send email.") {
        this._notificationService.printSuccessMessage("Your appraisal has been submitted but we cannot send email.");
        this.loadData();
        this.modifyAppraisalModal.hide();
      }
      else {
        this._handleErrorService.handleError(error);
      }
      this.updateAppraisalLoading = false;
    });
  }

  exportExcel() {
    //  alert(JSON.stringify(this.appraisalFrom));
    // Date problem
    let _appraisalMonth = this.temporarydate.date.month.toString().length < 2 ? '0' + this.temporarydate.date.month : this.temporarydate.date.month;
    let _appraisalDay = this.temporarydate.date.day.toString().length < 2 ? '0' + this.temporarydate.date.day : this.temporarydate.date.day;
    let _reviewDate: string = this.temporarydate.date.year + '-' + _appraisalMonth + '-' + _appraisalDay + 'T12:00:00Z'
    this.appraisal.ReviewDate = new Date(_reviewDate);

    let _fromMonth = this.appraisalfrom.date.month.toString().length < 2 ? '0' + this.appraisalfrom.date.month : this.appraisalfrom.date.month;
    let _fromDay = this.appraisalfrom.date.day.toString().length < 2 ? '0' + this.appraisalfrom.date.day : this.appraisalfrom.date.day;
    let _fromDate: string = this.appraisalfrom.date.year + '-' + _fromMonth + '-' + _fromDay + 'T12:00:00Z'
    this.appraisal.From = new Date(_fromDate);

    let _toMonth = this.appraisalto.date.month.toString().length < 2 ? '0' + this.appraisalto.date.month : this.appraisalto.date.month;
    let _toDay = this.appraisalto.date.day.toString().length < 2 ? '0' + this.appraisalto.date.day : this.appraisalto.date.day;
    let _toDate: string = this.appraisalto.date.year + '-' + _toMonth + '-' + _toDay + 'T12:00:00Z'
    this.appraisal.To = new Date(_toDate);
    // End date problem

    this.appraisal.departmentEnName = JSON.parse(this.currentUser.departmentList).filter(c => c.Value == this.appraisal.DepartmentId)[0].Text;
    this._dataService.post('/api/appraisal/exportExcel', JSON.stringify(this.appraisal)).subscribe((response: any) => {
      window.open(SystemConstants.BASE_API + response);
      this._dataService.delete('/api/appraisal/deleteReportFile', 'reportPath', response).subscribe((response: Response) => { });
    }, error => this._handleErrorService.handleError(error));
  }

  // View Appraisal

  showViewAppraisalModal(Id, StatusId) {
    this.loadViewAppraisal(Id, StatusId);
    this.viewAppraisalModal.show();

  }

  loadViewAppraisal(Id, StatusId) {
    if (StatusId == 'S') {
      this._dataService.get('/api/appraisal/getAppraisal/' + Id).subscribe((response: any) => {
        this.viewAppraisal = response;

        this.viewAppraisal.departmentEnName = JSON.parse(this.currentUser.departmentList).filter(d => d.Value == this.viewAppraisal.DepartmentId)[0].Text;
        this.viewAppraisal.categoryName = JSON.parse(this.currentUser.categoryList).filter(c => c.Value == this.viewAppraisal.CategoryId)[0].Text;

        let fromDate = new Date(this.viewAppraisal.From);
        this.appraisalfrom = fromDate.getDate() + '/' + (fromDate.getMonth() + 1) + '/' + fromDate.getFullYear();
        let toDate = new Date(this.viewAppraisal.To);
        this.appraisalto = toDate.getDate() + '/' + (toDate.getMonth() + 1) + '/' + toDate.getFullYear();
        let reviewDate = new Date(this.viewAppraisal.ReviewDate);
        this.temporarydate = reviewDate.getDate() + '/' + (reviewDate.getMonth() + 1) + '/' + reviewDate.getFullYear();
      }, error => this._handleErrorService.handleError(error));
    }
    else {
      this._dataService.get('/api/AppraisalApproval/getViewAppraisalApproval?_appraisalId=' + Id + '&statusId=' + StatusId).subscribe((response: any) => {
        this.viewAppraisal = response;

        this.viewAppraisal.departmentEnName = JSON.parse(this.currentUser.departmentList).filter(d => d.Value == this.viewAppraisal.DepartmentId)[0].Text;
        this.viewAppraisal.categoryName = JSON.parse(this.currentUser.categoryList).filter(c => c.Value == this.viewAppraisal.CategoryId)[0].Text;

        let fromDate = new Date(this.viewAppraisal.From);
        this.appraisalfrom = fromDate.getDate() + '/' + (fromDate.getMonth() + 1) + '/' + fromDate.getFullYear();
        let toDate = new Date(this.viewAppraisal.To);
        this.appraisalto = toDate.getDate() + '/' + (toDate.getMonth() + 1) + '/' + toDate.getFullYear();
        let reviewDate = new Date(this.viewAppraisal.ReviewDate);
        this.temporarydate = reviewDate.getDate() + '/' + (reviewDate.getMonth() + 1) + '/' + reviewDate.getFullYear();
        // console.log(this.viewAppraisal);
      }, error => this._handleErrorService.handleError(error));
    }
  }

  exportViewAppraisalToExcel(StatusId) {
    this.viewAppraisal.DepartmentEnName = JSON.parse(this.currentUser.departmentList).filter(c => c.Value == this.viewAppraisal.DepartmentId)[0].Text;
    this._dataService.post('/api/appraisal/exportExcel', JSON.stringify(this.viewAppraisal)).subscribe((response: any) => {
      window.open(SystemConstants.BASE_API + response);
      this._dataService.delete('/api/appraisal/deleteReportFile', 'reportPath', response).subscribe((response: Response) => { });
    }, error => this._handleErrorService.handleError(error));
  }
  // End of View Appraisal
}
