import { Component, OnInit, ViewChild } from '@angular/core';

import { IMyDpOptions } from 'mydatepicker';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { DataService } from '../../../../core/services/data.service';
import { AuthenService } from '../../../../core/services/authen.service';
import { HandleErrorService } from '../../../../core/services/handle-error.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { LoggedInUser } from '../../../../core/domain/loggedin.user';
import { MessageConstants } from '../../../../core/common/message.constants';
import { SystemConstants } from '../../../../core/common/system.constants';

@Component({
  selector: 'app-goalindex',
  templateUrl: './goalindex.component.html',
  styleUrls: ['./goalindex.component.css']
})

export class GoalIndexComponent implements OnInit {
  @ViewChild('modifySmartGoalModal') public modifySmartGoalModal: ModalDirective;
  @ViewChild('viewSmartGoalModal') public viewSmartGoalModal: ModalDirective;
  saveGoalLoading: Boolean;
  smartGoals = [];
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRow: number;
  filter: string = '';
  maxSize: number = 10;
  currentUser: LoggedInUser;
  departmentList;
  categoryList;
  deleteSmartGoalLoading: Boolean;
  height: string;
  smartGoal: any;
  viewSmartGoal:any;
  smartGoalFrom;
  smartGoalTo;
  temporarydate;
  goal1Contents = [];
  goal1Content: any = {};
  goal2Contents = [];
  goal2Content: any = {};
  goal3Contents = [];
  goal3Content: any = {};
  goal4Contents = [];
  goal4Content: any = {};
  personalDevelopmentContents = [];
  personalDevelopmentContent: any = {};
  viewGoal1Contents = [];
  viewGoal2Contents = [];
  viewGoal3Contents = [];
  viewGoal4Contents = [];
  viewPersonalDevelopmentContents = [];
  viewSmartGoalFrom;
  viewSmartGoalTo;
  viewSmartGoalReviewDate;

  constructor(private _dataService: DataService, private _authenService: AuthenService, private _handleErrorService: HandleErrorService,
    private _notificationService: NotificationService) {
    this.currentUser = this._authenService.getLoggedInUser();
  }

  ngOnInit() {
    this.departmentList = JSON.parse(this.currentUser.departmentList);
    this.categoryList = JSON.parse(this.currentUser.categoryList);
    this.loadData();
  }

  loadData() {
    this._dataService.get('/api/SmartGoal/getlistpaging?pageIndex=' + this.pageIndex + '&pagesize=' + this.pageSize + '&filter=' + this.filter)
      .subscribe((response: any) => {
        this.smartGoals = response.Items;
        // console.log(this.smartGoals);
        this.smartGoals.forEach(element => {
          element.statusName = JSON.parse(this.currentUser.statusList).filter(s => s.Value == element.StatusId)[0].Text;
          element.categoryName = JSON.parse(this.currentUser.categoryList).filter(s => s.Value == element.CategoryId)[0].Text;
        });
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.totalRow = response.TotalRow;
      }, error => {
        // alert(JSON.stringify(error));
        this._handleErrorService.handleError(error);
      });
  }

  private myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
  };

  saveSmartGoal(valid) {
    if (!valid) return;
    this.saveGoalLoading = true;
    // Date problem
    let _reviewMonth = this.temporarydate.date.month.toString().length < 2 ? '0' + this.temporarydate.date.month : this.temporarydate.date.month;
    let _reviewDay = this.temporarydate.date.day.toString().length < 2 ? '0' + this.temporarydate.date.day : this.temporarydate.date.day;
    let _reviewDate: string = this.temporarydate.date.year + '-' + _reviewMonth + '-' + _reviewDay + 'T12:00:00Z'
    this.smartGoal.ReviewDate = new Date(_reviewDate);

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
      if (this.smartGoal.statusId == 'N') this._notificationService.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
      if (this.smartGoal.statusId == 'S') this._notificationService.printSuccessMessage(MessageConstants.SUBMIT_GOAL_SUCCESS);
      this.saveGoalLoading = false;
      this.loadData();
      this.modifySmartGoalModal.hide();
    }, error => {
      // alert(JSON.stringify(error));
      if (JSON.parse(error._body).Message == "Your smart goal has been submitted but we cannot send email.") {
        this._notificationService.printSuccessMessage("Your smart goal has been submitted but we cannot send email.");
        this.modifySmartGoalModal.hide();
        this.loadData();
      }
      else {
        this._handleErrorService.handleError(error);
      }
      this.saveGoalLoading = false;
    });
  }

  deleteSmartGoal(id: string) {
    this.deleteSmartGoalLoading = true;
    this._notificationService.printConfirmationDialog(MessageConstants.CONFIRM_DELETE_MSG, () => {
      this.deleteSmartGoalConfirm(id);
    });
  }

  deleteSmartGoalConfirm(id) {
    this._dataService.delete('/api/SmartGoal/delete', 'id', id).subscribe((response: any) => {
      this.loadData();
      this._notificationService.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
      this.deleteSmartGoalLoading = false;
    }, error => {
      this._handleErrorService.handleError(error);
      this.deleteSmartGoalLoading = false;
    });
  };

  pageChanged(event: any): void {
    // debugger
    this.pageIndex = event.page;
    this.loadData();
  }

  showModifySmartGoalModal(Id) {
    this.loadSmartGoal(Id);
    this.modifySmartGoalModal.show();
    //  document.getElementById('goalContentTableHeader').style.height = document.getElementById('goalTableHeader').offsetHeight + 'px';
  }

  loadSmartGoal(Id) {
    this.goal1Content = {};
    this.goal2Content = {};
    this.goal3Content = {};
    this.goal4Content = {};
    this.personalDevelopmentContent = {};

    this._dataService.get('/api/SmartGoal/getSmartGoal/' + Id).subscribe((response: any) => {
      this.smartGoal = response;
      this.smartGoal.ReviewerName = this.currentUser.reviewerName;
      this.smartGoal.ReviewerTitle = this.currentUser.reviewerTitle;
      // console.log(this.smartGoal);
      this.smartGoal.departmentEnName = JSON.parse(this.currentUser.departmentList).filter(a => a.Value == this.smartGoal.DepartmentId)[0].Text;
      this.smartGoal.categoryName = JSON.parse(this.currentUser.categoryList).filter(a => a.Value == this.smartGoal.CategoryId)[0].Text;
      let fromDate = new Date(response.From);
      this.smartGoalFrom = { date: { year: fromDate.getFullYear(), month: fromDate.getMonth() + 1, day: fromDate.getDate() } };
      let toDate = new Date(response.To);
      this.smartGoalTo = { date: { year: toDate.getFullYear(), month: toDate.getMonth() + 1, day: toDate.getDate() } };
      let reviewDate = new Date(response.ReviewDate)
      this.temporarydate = { date: { year: reviewDate.getFullYear(), month: reviewDate.getMonth() + 1, day: reviewDate.getDate() } };

      this.goal1Contents = JSON.parse(response.Goal1Content);
      this.goal2Contents = JSON.parse(response.Goal2Content);
      this.goal3Contents = JSON.parse(response.Goal3Content);
      this.goal4Contents = JSON.parse(response.Goal4Content);
      this.personalDevelopmentContents = JSON.parse(response.PersonalDevelopmentContent);
      // alert(this.goal1Contents.length);
    }, error => this._handleErrorService.handleError(error));
  }

  goalIsValid() {
    let IsValid: Boolean = true;
    // if (this.smartGoal.goal1 == 0 && this.goal1Contents.length > 0) IsValid = false;
    // if (this.smartGoal.goal2 == 0 && this.goal2Contents.length > 0) IsValid = false;
    // if (this.smartGoal.goal3 == 0 && this.goal3Contents.length > 0) IsValid = false;
    // if (this.smartGoal.goal4 == 0 && this.goal4Contents.length > 0) IsValid = false;
    // if (this.smartGoal.goal1 == 0 && this.goal1Content.plan) IsValid = false;
    // if (this.smartGoal.goal2 == 0 && this.goal2Content.plan) IsValid = false;
    // if (this.smartGoal.goal3 == 0 && this.goal3Content.plan) IsValid = false;
    // if (this.smartGoal.goal4 == 0 && this.goal4Content.plan) IsValid = false;
    if (this.goal1Contents.length == 0 && this.goal2Contents.length == 0 && this.goal3Contents.length == 0 && this.goal4Contents.length == 0
      && !this.goal1Content.plan && !this.goal2Content.plan && !this.goal3Content.plan && !this.goal4Content.plan) IsValid = false;
    return IsValid;
  }

  // Goal content
  addContent(name: string): void {
    switch (name) {
      case 'goal1':
        if (!this.goal1Content.plan.trim()) return;
        let newGoal1Content = {
          plan: this.goal1Content.plan.trim(),
          date: this.goal1Content.date? this.goal1Content.date.trim(): undefined,
          measure: this.goal1Content.measure? this.goal1Content.measure.trim(): undefined
        };
        this.goal1Contents.push(newGoal1Content);
        this.goal1Content = {};
        document.getElementById('goal1ContentPlan').focus();
        break;
      case 'goal2':
        if (!this.goal2Content.plan.trim()) return;
        let newGoal2Content = {
          plan: this.goal2Content.plan.trim(),
          date: this.goal2Content.date? this.goal2Content.date.trim(): undefined,
          measure: this.goal2Content.measure? this.goal2Content.measure.trim(): undefined
        };
        this.goal2Contents.push(newGoal2Content);
        this.goal2Content = {};
        document.getElementById('goal2ContentPlan').focus();
        break;
      case 'goal3':
        if (!this.goal3Content.plan.trim()) return;
        let newGoal3Content = {
          plan: this.goal3Content.plan.trim(),
          date: this.goal3Content.date? this.goal3Content.date.trim(): undefined,
          measure: this.goal3Content.measure? this.goal3Content.measure.trim(): undefined
        };
        this.goal3Contents.push(newGoal3Content);
        this.goal3Content = {};
        document.getElementById('goal3ContentPlan').focus();
        break;
      case 'goal4':
        if (!this.goal4Content.plan.trim()) return;
        let newGoal4Content = {
          plan: this.goal4Content.plan.trim(),
          date: this.goal4Content.date? this.goal4Content.date.trim(): undefined,
          measure: this.goal4Content.measure? this.goal4Content.measure.trim(): undefined
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
          // alert(JSON.stringify(this.goal1Content.plan) + this.goal1Contents.length.toString());
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

  // Generate Total Score
  generateTotalScore() {
    // debugger;
    let noGoals = 0;
    if (this.smartGoal.Goal1 > 0) noGoals++;
    if (this.smartGoal.Goal2 > 0) noGoals++;
    if (this.smartGoal.Goal3 > 0) noGoals++;
    if (this.smartGoal.Goal4 > 0) noGoals++;
    this.smartGoal.TotalScore = (noGoals == 0) ? 0 : (this.smartGoal.Goal1 + this.smartGoal.Goal2 + this.smartGoal.Goal3 + this.smartGoal.Goal4) / noGoals;
  }
  // End of Total Score

  uncheckGoal(name: string) {
    // alert('b')
    switch (name) {
      case 'goal1':
        this.smartGoal.Goal1 = 0; this.generateTotalScore(); break;
      case 'goal2':
        this.smartGoal.Goal2 = 0; this.generateTotalScore(); break;
      case 'goal3':
        this.smartGoal.Goal3 = 0; this.generateTotalScore(); break;
      case 'goal4':
        this.smartGoal.Goal4 = 0; this.generateTotalScore(); break;
      default: return;
    }
  }

  removePersonalDevelopmentContent(index: number) {
    if (!this.personalDevelopmentContents[index].plan.trim()) {
      this.personalDevelopmentContents.splice(index, 1);
      document.getElementById('personalDevelopmentContentPlan').focus();
    }
  }

  removePersonalDevelopment() {
    this.personalDevelopmentContents = [];
    this.personalDevelopmentContent = {};
  }

  uncheckKeyPerformance(name: string): Boolean {
    // alert('a');
    // debugger;
    switch (name) {
      case 'goal1':
        this.smartGoal.Goal1Customer = false;
        this.smartGoal.Goal1Finance = false;
        this.smartGoal.Goal1Employee = false;
        this.smartGoal.Goal1Operating = false;
        break;
      case 'goal2':
        this.smartGoal.Goal2Customer = false;
        this.smartGoal.Goal2Finance = false;
        this.smartGoal.Goal2Employee = false;
        this.smartGoal.Goal2Internal = false;
        break;
      case 'goal3':
        this.smartGoal.Goal3Customer = false;
        this.smartGoal.Goal3Finance = false;
        this.smartGoal.Goal3Employee = false;
        this.smartGoal.Goal3Internal = false;
        break;
      case 'goal4':
        this.smartGoal.Goal4Customer = false;
        this.smartGoal.Goal4Finance = false;
        this.smartGoal.Goal4Employee = false;
        this.smartGoal.Goal4Internal = false;
        break;
    }
    return false;
  }

  addPersonalDevelopmentContent(): void {
    if (!this.personalDevelopmentContent.plan) return;
    let newPersonalDevelopmentContent = {
      plan: this.personalDevelopmentContent.plan.trim(),
      date: this.personalDevelopmentContent.date? this.personalDevelopmentContent.date.trim(): undefined,
      measure: this.personalDevelopmentContent.measure? this.personalDevelopmentContent.measure.trim(): undefined
    };
    this.personalDevelopmentContents.push(newPersonalDevelopmentContent);
    this.personalDevelopmentContent = {};
    document.getElementById('personalDevelopmentContentPlan').focus();
  }

  exportExcel(valid) {
    //  alert(JSON.stringify(this.appraisalFrom));
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

    if (this.goal1Content.plan) this.goal1Contents.push(this.goal1Content);
    if (this.goal2Content.plan) this.goal2Contents.push(this.goal2Content);
    if (this.goal3Content.plan) this.goal3Contents.push(this.goal3Content);
    if (this.goal4Content.plan) this.goal4Contents.push(this.goal4Content);
    if (this.personalDevelopmentContent.plan) this.personalDevelopmentContents.push(this.personalDevelopmentContent);

    this.goal1Content = {};
    this.goal2Content = {};
    this.goal3Content = {};
    this.goal4Content = {};
    this.personalDevelopmentContent={};

    this.smartGoal.goal1Content = JSON.stringify(this.goal1Contents);
    this.smartGoal.goal2Content = JSON.stringify(this.goal2Contents);
    this.smartGoal.goal3Content = JSON.stringify(this.goal3Contents);
    this.smartGoal.goal4Content = JSON.stringify(this.goal4Contents);
    this.smartGoal.personalDevelopmentContent = JSON.stringify(this.personalDevelopmentContents);

    this.smartGoal.departmentEnName = JSON.parse(this.currentUser.departmentList).filter(c => c.Value == this.smartGoal.DepartmentId)[0].Text;

    let exportExcelPromise = new Promise((Resolve, Reject)=>{
      this._dataService.post('/api/SmartGoal/exportExcel', JSON.stringify(this.smartGoal)).subscribe((response: any) => {
        window.open(SystemConstants.BASE_API + response);
        this.saveGoalLoading = false;
        setTimeout(()=> Resolve(response),300000);
        // window.location.href = this.baseFolder + response.Message;
      }, error => {
        this._handleErrorService.handleError(error);
        this.saveGoalLoading = false;
      });
    });
    exportExcelPromise.then((element)=>{
      this._dataService.delete('/api/Report/deleteReportFile', 'reportPath', element.toString()).subscribe((response: Response) => { });
      // this.saveGoalLoading = false;
    });
    
  }

  // View Smart Goal

  showViewSmartGoalModal(Id, StatusId) {
    this.loadViewSmartGoal(Id, StatusId);
    this.viewSmartGoalModal.show();

  }

  loadViewSmartGoal(Id, StatusId) {

    if (StatusId == 'S') {
      this._dataService.get('/api/smartgoal/getSmartGoal/' + Id).subscribe((response: any) => {
        this.viewSmartGoal = response;

        this.viewSmartGoal.ReviewerName = this.currentUser.reviewerName;
        this.viewSmartGoal.ReviewerTitle = this.currentUser.reviewerTitle
        this.viewSmartGoal.DepartmentEnName = JSON.parse(this.currentUser.departmentList).filter(d => d.Value == this.viewSmartGoal.DepartmentId)[0].Text;
        this.viewSmartGoal.CategoryName = JSON.parse(this.currentUser.categoryList).filter(c => c.Value == this.viewSmartGoal.CategoryId)[0].Text;

        let fromDate = new Date(this.viewSmartGoal.From);
        this.viewSmartGoalFrom = fromDate.getDate() + '/' + (fromDate.getMonth() + 1) + '/' + fromDate.getFullYear();
        let toDate = new Date(this.viewSmartGoal.To);
        this.viewSmartGoalTo = toDate.getDate() + '/' + (toDate.getMonth() + 1) + '/' + toDate.getFullYear();
        let reviewDate = new Date(this.viewSmartGoal.ReviewDate);
        this.viewSmartGoalReviewDate = reviewDate.getDate() + '/' + (reviewDate.getMonth() + 1) + '/' + reviewDate.getFullYear();

        this.viewGoal1Contents = JSON.parse(response.Goal1Content);
        this.viewGoal2Contents = JSON.parse(response.Goal2Content);
        this.viewGoal3Contents = JSON.parse(response.Goal3Content);
        this.viewGoal4Contents = JSON.parse(response.Goal4Content);
        this.viewPersonalDevelopmentContents = JSON.parse(response.PersonalDevelopmentContent);
        // alert(JSON.stringify(response));
      }, error => this._handleErrorService.handleError(error));
    }
    else {
      this._dataService.get('/api/SmartGoalApproval/getViewSmartGoalApproval?_smartGoalId=' + Id + '&statusId=' + StatusId).subscribe((response: any) => {
        this.viewSmartGoal = response;

        this.viewSmartGoal.DepartmentEnName = JSON.parse(this.currentUser.departmentList).filter(d => d.Value == this.viewSmartGoal.DepartmentId)[0].Text;
        this.viewSmartGoal.CategoryName = JSON.parse(this.currentUser.categoryList).filter(c => c.Value == this.viewSmartGoal.CategoryId)[0].Text;

        let fromDate = new Date(this.viewSmartGoal.From);
        this.viewSmartGoalFrom = fromDate.getDate() + '/' + (fromDate.getMonth() + 1) + '/' + fromDate.getFullYear();
        let toDate = new Date(this.viewSmartGoal.To);
        this.viewSmartGoalTo = toDate.getDate() + '/' + (toDate.getMonth() + 1) + '/' + toDate.getFullYear();
        let reviewDate = new Date(this.viewSmartGoal.ReviewDate);
        this.viewSmartGoalReviewDate = reviewDate.getDate() + '/' + (reviewDate.getMonth() + 1) + '/' + reviewDate.getFullYear();

        this.viewGoal1Contents = JSON.parse(response.Goal1Content);
        this.viewGoal2Contents = JSON.parse(response.Goal2Content);
        this.viewGoal3Contents = JSON.parse(response.Goal3Content);
        this.viewGoal4Contents = JSON.parse(response.Goal4Content);
        this.viewPersonalDevelopmentContents = JSON.parse(response.PersonalDevelopmentContent);
        // console.log(this.viewSmartGoal);
      }, error => this._handleErrorService.handleError(error));
    }
  }

  exportViewSmartGoalToExcel() {
    this.viewSmartGoal.DepartmentEnName = JSON.parse(this.currentUser.departmentList).filter(c => c.Value == this.viewSmartGoal.DepartmentId)[0].Text;
    // console.log(this.viewSmartGoal);
    let exportExcelPromise = new Promise((Resolve, Reject)=>{
      this._dataService.post('/api/smartgoal/exportExcel', JSON.stringify(this.viewSmartGoal)).subscribe((response: any) => {
        window.open(SystemConstants.BASE_API + response);
        Resolve(response);
      }, error => this._handleErrorService.handleError(error));
    });
    exportExcelPromise.then((element)=>this._dataService.delete('/api/Report/deleteReportFile', 'reportPath', element.toString()).subscribe((response: Response) => { }));
  }
  // End of View SmartGoal
}
