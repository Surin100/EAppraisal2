import { Component, OnInit, ViewChild } from '@angular/core';

import { IMyDpOptions } from 'mydatepicker';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { DataService } from '../../../core/services/data.service';
import { AuthenService } from '../../../core/services/authen.service';
import { LoggedInUser } from '../../../core/domain/loggedin.user';
import { HandleErrorService } from '../../../core/services/handle-error.service';
import { NotificationService } from '../../../core/services/notification.service';
import { MessageConstants } from '../../../core/common/message.constants';
import { SystemConstants } from '../../../core/common/system.constants';

@Component({
  selector: 'app-goalapproval',
  templateUrl: './goalapproval.component.html',
  styleUrls: ['./goalapproval.component.css']
})
export class GoalApprovalComponent implements OnInit {
  @ViewChild('approveSmartGoalModal') public approveSmartGoalModal: ModalDirective;
  approveLoading: Boolean = false;
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRow: number;
  filter: string = '';
  maxSize: number = 10;
  smartGoals: any[];
  // smartGoal: any;
  smartGoalApproval: any;
  currentUser: LoggedInUser;
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
  smartGoalFrom;
  smartGoalTo;
  temporarydate;
  departmentList;
  categoryList;
  // exportIndex: any = {};

  departmentSearchList = [];
  statusSearchList = [];
  search: any = {};

  constructor(private _dataService: DataService, private _authenService: AuthenService, private _handleErrorService: HandleErrorService,
    private _notificationService: NotificationService) { }

  ngOnInit() {
    let dateNow: Date = new Date(Date.now());
    this.search.FromYear = dateNow.getFullYear();
    this.search.ToYear = dateNow.getFullYear();
    this.search.DepartmentId = 'All';
    this.search.StatusId = 'All'
    this.currentUser = this._authenService.getLoggedInUser();
    this.departmentList = JSON.parse(this.currentUser.departmentList);
    this.categoryList = JSON.parse(this.currentUser.categoryList);

    this.departmentSearchList = JSON.parse(this.currentUser.departmentList);
    this.departmentSearchList.push({ Disabled: false, Group: null, Selected: true, Text: 'All', Value: 'All' });

    this.statusSearchList = JSON.parse(this.currentUser.statusList);
    this.statusSearchList.push({ Disabled: false, Group: null, Selected: true, Text: 'All', Value: 'All' });

    this.loadData()
  }

  private myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
  };

  loadData() {

    if (this.search.EmployeeId === undefined) this.search.EmployeeId = '';
    if (this.search.EmployeeName === undefined) this.search.EmployeeName = '';
    if (this.search.EmployeeTitle === undefined) this.search.EmployeeTitle = '';

    this._dataService.get('/api/SmartGoal/GetNeedYourSmartGoalApprovalListPaging?pageIndex=' + this.pageIndex + '&pagesize=' + this.pageSize +
      '&employeeId=' + this.search.EmployeeId + '&employeeName=' + this.search.EmployeeName + '&departmentId=' + this.search.DepartmentId +
      '&employeeTitle=' + this.search.EmployeeTitle + '&statusId=' + this.search.StatusId +
      '&fromYear=' + this.search.FromYear + '&toYear=' + this.search.ToYear)
      .subscribe((response: any) => {
        this.smartGoals = response.Items;
        this.smartGoals.forEach(element => {
          element.StatusName = JSON.parse(this.currentUser.statusList).filter(a => a.Value == element.StatusId)[0].Text;
        });
        // console.log(this.appraisals);
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.totalRow = response.TotalRow;
      }, error => this._handleErrorService.handleError(error));
  }

  pageChanged(event) {
    this.pageIndex = event.page;
    this.loadData();
  }

  showApproveSmartGoalModal(Id, StatusId: String) {
    this.loadSmartGoal(Id, StatusId);
    this.approveSmartGoalModal.show();
  }

  loadSmartGoal(Id, StatusId: String) {
    this.goal1Content = {};
    this.goal2Content = {};
    this.goal3Content = {};
    this.goal4Content = {};
    this.personalDevelopmentContent = {};
    if (StatusId === 'S') {
      this._dataService.get('/api/SmartGoal/getSmartGoal/' + Id).subscribe((response: any) => {
        this.smartGoalApproval = response;
        this.smartGoalApproval.SmartGoalId = response.Id;
        this.smartGoalApproval.AppraiseeId = response.UserId;
        this.smartGoalApproval.ReviewerName = this.currentUser.fullName;
        this.smartGoalApproval.ReviewerTitle = this.currentUser.jobTitle;
        // console.log(this.smartGoal);
        this.smartGoalApproval.DepartmentEnName = JSON.parse(this.currentUser.departmentList).filter(a => a.Value == this.smartGoalApproval.DepartmentId)[0].Text;
        this.smartGoalApproval.CategoryName = JSON.parse(this.currentUser.categoryList).filter(a => a.Value == this.smartGoalApproval.CategoryId)[0].Text;
        let fromDate = new Date(response.From);
        // this.smartGoalFrom = fromDate.getDate() + '/' + (fromDate.getMonth() + 1) + '/' + fromDate.getFullYear();
        this.smartGoalFrom = { date: { year: fromDate.getFullYear(), month: fromDate.getMonth() + 1, day: fromDate.getDate() } };
        let toDate = new Date(response.To);
        // this.smartGoalTo = toDate.getDate() + '/' + (toDate.getMonth() + 1) + '/' + toDate.getFullYear();
        this.smartGoalTo = { date: { year: toDate.getFullYear(), month: toDate.getMonth() + 1, day: toDate.getDate() } };
        let reviewDate = new Date(response.ReviewDate)
        this.temporarydate = { date: { year: reviewDate.getFullYear(), month: reviewDate.getMonth() + 1, day: reviewDate.getDate() } };

        this.goal1Contents = JSON.parse(response.Goal1Content);
        this.goal2Contents = JSON.parse(response.Goal2Content);
        this.goal3Contents = JSON.parse(response.Goal3Content);
        this.goal4Contents = JSON.parse(response.Goal4Content);
        this.personalDevelopmentContents = JSON.parse(response.PersonalDevelopmentContent);
        // console.log(this.smartGoalApproval);
        // alert(JSON.stringify(this.goal1Contents));
      }, error => this._handleErrorService.handleError(error));
    }
    else {
      this._dataService.get('/api/SmartGoalApproval/GetViewSmartGoalApproval/?_smartGoalId=' + Id + '&statusId=' + StatusId).subscribe((response: any) => {
        this.smartGoalApproval = response;
        this.smartGoalApproval.AppraiseeId = response.UserId;
        // console.log(this.smartGoal);
        this.smartGoalApproval.DepartmentEnName = JSON.parse(this.currentUser.departmentList).filter(a => a.Value == this.smartGoalApproval.DepartmentId)[0].Text;
        this.smartGoalApproval.CategoryName = JSON.parse(this.currentUser.categoryList).filter(a => a.Value == this.smartGoalApproval.CategoryId)[0].Text;
        let fromDate = new Date(response.From);
        // this.smartGoalFrom = fromDate.getDate() + '/' + (fromDate.getMonth() + 1) + '/' + fromDate.getFullYear();
        this.smartGoalFrom = { date: { year: fromDate.getFullYear(), month: fromDate.getMonth() + 1, day: fromDate.getDate() } };
        let toDate = new Date(response.To);
        // this.smartGoalTo = toDate.getDate() + '/' + (toDate.getMonth() + 1) + '/' + toDate.getFullYear();
        this.smartGoalTo = { date: { year: toDate.getFullYear(), month: toDate.getMonth() + 1, day: toDate.getDate() } };
        let reviewDate = new Date(response.ReviewDate)
        this.temporarydate = { date: { year: reviewDate.getFullYear(), month: reviewDate.getMonth() + 1, day: reviewDate.getDate() } };

        this.goal1Contents = JSON.parse(response.Goal1Content);
        this.goal2Contents = JSON.parse(response.Goal2Content);
        this.goal3Contents = JSON.parse(response.Goal3Content);
        this.goal4Contents = JSON.parse(response.Goal4Content);
        this.personalDevelopmentContents = JSON.parse(response.PersonalDevelopmentContent);
        // console.log(this.smartGoalApproval);
        // alert(JSON.stringify(this.goal1Contents));
      }, error => this._handleErrorService.handleError(error));
    }

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

  approveSmartGoal(valid: Boolean) {
    if (!valid || this.smartGoalApproval.SmartGoalId == undefined) return;

    if (this.smartGoalApproval.statusId == 'V') {
      this._notificationService.printConfirmationDialog(MessageConstants.CONFIRM_REJECT_SMARTGOAL_MSG, () => {
        this.approveLoading = true;
        this.saveApproval();
      });
    } else {
      this.approveLoading = true;
      this.saveApproval();
    }
  }

  saveApproval() {
    // Date problem
    let _reviewMonth = this.temporarydate.date.month.toString().length < 2 ? '0' + this.temporarydate.date.month : this.temporarydate.date.month;
    let _reviewDay = this.temporarydate.date.day.toString().length < 2 ? '0' + this.temporarydate.date.day : this.temporarydate.date.day;
    let _reviewDate: string = this.temporarydate.date.year + '-' + _reviewMonth + '-' + _reviewDay + 'T15:00:00Z'
    this.smartGoalApproval.reviewDate = new Date(_reviewDate);

    let _fromMonth = this.smartGoalFrom.date.month.toString().length < 2 ? '0' + this.smartGoalFrom.date.month : this.smartGoalFrom.date.month;
    let _fromDay = this.smartGoalFrom.date.day.toString().length < 2 ? '0' + this.smartGoalFrom.date.day : this.smartGoalFrom.date.day;
    let _fromDate: string = this.smartGoalFrom.date.year + '-' + _fromMonth + '-' + _fromDay + 'T12:00:00Z'
    this.smartGoalApproval.From = new Date(_fromDate);

    let _toMonth = this.smartGoalTo.date.month.toString().length < 2 ? '0' + this.smartGoalTo.date.month : this.smartGoalTo.date.month;
    let _toDay = this.smartGoalTo.date.day.toString().length < 2 ? '0' + this.smartGoalTo.date.day : this.smartGoalTo.date.day;
    let _toDate: string = this.smartGoalTo.date.year + '-' + _toMonth + '-' + _toDay + 'T12:00:00Z'
    this.smartGoalApproval.To = new Date(_toDate);

    if (this.goal1Content.plan) this.goal1Contents.push(this.goal1Content);
    if (this.goal2Content.plan) this.goal2Contents.push(this.goal2Content);
    if (this.goal3Content.plan) this.goal3Contents.push(this.goal3Content);
    if (this.goal4Content.plan) this.goal4Contents.push(this.goal4Content);
    if (this.personalDevelopmentContent.plan) this.personalDevelopmentContents.push(this.personalDevelopmentContent);

    this.smartGoalApproval.goal1Content = JSON.stringify(this.goal1Contents);
    this.smartGoalApproval.goal2Content = JSON.stringify(this.goal2Contents);
    this.smartGoalApproval.goal3Content = JSON.stringify(this.goal3Contents);
    this.smartGoalApproval.goal4Content = JSON.stringify(this.goal4Contents);
    this.smartGoalApproval.personalDevelopmentContent = JSON.stringify(this.personalDevelopmentContents);

    // alert(JSON.stringify(this.smartGoalApproval));
    // End Date problem
    this._dataService.post('/api/SmartGoalApproval/SaveSmartGoalApproval', this.smartGoalApproval).subscribe((response: any) => {
      if (this.smartGoalApproval.statusId == 'V') {
        this._notificationService.printSuccessMessage(MessageConstants.REJECT_SUCCESS);
      } else {
        this._notificationService.printSuccessMessage(MessageConstants.APPROVE_SUCCESS);
      }
      this.approveLoading = false;
      this.approveSmartGoalModal.hide();
      this.loadData();
    }, error => {
      // alert(JSON.stringify(error));
      if (JSON.parse(error._body).Message == "Approve succeeded but we cannot send mail.") {
        this._notificationService.printSuccessMessage("Approve succeeded but we cannot send mail.");
        this.loadData();
        this.approveSmartGoalModal.hide();
      }
      else if (JSON.parse(error._body).Message == "Reject succeeded but we cannot send mail.") {
        this._notificationService.printSuccessMessage("Reject succeeded but we cannot send mail.");
        this.loadData();
        this.approveSmartGoalModal.hide();
      }
      else {
        this._handleErrorService.handleError(error);
      }
      this.approveLoading = false;
    });
  }

  exportExcel(valid) {
    //  alert(JSON.stringify(this.appraisalFrom));
    if (!valid) return;
    // this.saveGoalLoading = true;
    // Date problem
    // let _reviewMonth = this.temporarydate.date.month.toString().length < 2 ? '0' + this.temporarydate.date.month : this.temporarydate.date.month;
    // let _reviewDay = this.temporarydate.date.day.toString().length < 2 ? '0' + this.temporarydate.date.day : this.temporarydate.date.day;
    // let _reviewDate: string = this.temporarydate.date.year + '-' + _reviewMonth + '-' + _reviewDay + 'T12:00:00Z'
    // this.smartGoal.reviewDate = new Date(_reviewDate);

    // let _fromMonth = this.smartGoalFrom.date.month.toString().length < 2 ? '0' + this.smartGoalFrom.date.month : this.smartGoalFrom.date.month;
    // let _fromDay = this.smartGoalFrom.date.day.toString().length < 2 ? '0' + this.smartGoalFrom.date.day : this.smartGoalFrom.date.day;
    // let _fromDate: string = this.smartGoalFrom.date.year + '-' + _fromMonth + '-' + _fromDay + 'T12:00:00Z'
    // this.smartGoal.From = new Date(_fromDate);

    // let _toMonth = this.smartGoalTo.date.month.toString().length < 2 ? '0' + this.smartGoalTo.date.month : this.smartGoalTo.date.month;
    // let _toDay = this.smartGoalTo.date.day.toString().length < 2 ? '0' + this.smartGoalTo.date.day : this.smartGoalTo.date.day;
    // let _toDate: string = this.smartGoalTo.date.year + '-' + _toMonth + '-' + _toDay + 'T12:00:00Z'
    // this.smartGoal.To = new Date(_toDate);

    if (this.goal1Content.plan) this.goal1Contents.push(this.goal1Content);
    if (this.goal2Content.plan) this.goal2Contents.push(this.goal2Content);
    if (this.goal3Content.plan) this.goal3Contents.push(this.goal3Content);
    if (this.goal4Content.plan) this.goal4Contents.push(this.goal4Content);
    if (this.personalDevelopmentContent.plan) this.personalDevelopmentContents.push(this.personalDevelopmentContent);

    this.goal1Content = {};
    this.goal2Content = {};
    this.goal3Content = {};
    this.goal4Content = {};
    this.personalDevelopmentContent = {};

    this.smartGoalApproval.goal1Content = JSON.stringify(this.goal1Contents);
    this.smartGoalApproval.goal2Content = JSON.stringify(this.goal2Contents);
    this.smartGoalApproval.goal3Content = JSON.stringify(this.goal3Contents);
    this.smartGoalApproval.goal4Content = JSON.stringify(this.goal4Contents);
    this.smartGoalApproval.personalDevelopmentContent = JSON.stringify(this.personalDevelopmentContents);

    // this.smartGoal.departmentEnName = JSON.parse(this.currentUser.departmentList).filter(c => c.Value == this.smartGoal.departmentId)[0].Text;

    let exportExcelPromise = new Promise((Resolve, Reject) => {
      this._dataService.post('/api/SmartGoal/exportExcel', JSON.stringify(this.smartGoalApproval)).subscribe((response: any) => {
        window.open(SystemConstants.BASE_API + response);
        this.approveLoading = false;
        // Resolve(response);
        setTimeout(() => Resolve(response), 300000);
      }, error => {
        this._handleErrorService.handleError(error);
        this.approveLoading = false;
      });
    });
    exportExcelPromise.then((element) => {
      this._dataService.delete('/api/Report/deleteReportFile', 'reportPath', element.toString()).subscribe((response: Response) => { });
      // this.approveLoading = false;
    });

  }

  uncheckKeyPerformance(name: string): Boolean {
    // alert('a');
    // debugger;
    switch (name) {
      case 'goal1':
        this.smartGoalApproval.Goal1Customer = false;
        this.smartGoalApproval.Goal1Finance = false;
        this.smartGoalApproval.Goal1Employee = false;
        this.smartGoalApproval.Goal1Operating = false;
        break;
      case 'goal2':
        this.smartGoalApproval.Goal2Customer = false;
        this.smartGoalApproval.Goal2Finance = false;
        this.smartGoalApproval.Goal2Employee = false;
        this.smartGoalApproval.Goal2Internal = false;
        break;
      case 'goal3':
        this.smartGoalApproval.Goal3Customer = false;
        this.smartGoalApproval.Goal3Finance = false;
        this.smartGoalApproval.Goal3Employee = false;
        this.smartGoalApproval.Goal3Internal = false;
        break;
      case 'goal4':
        this.smartGoalApproval.Goal4Customer = false;
        this.smartGoalApproval.Goal4Finance = false;
        this.smartGoalApproval.Goal4Employee = false;
        this.smartGoalApproval.Goal4Internal = false;
        break;
    }
    return false;
  }

  // Goal content

  addContent(name: string): void {
    // debugger;
    switch (name) {
      case 'goal1':
        if (!this.goal1Content.plan.trim()) return;
        let newGoal1Content = {
          plan: this.goal1Content.plan.trim(),
          date: this.goal1Content.date ? this.goal1Content.date.trim() : undefined,
          measure: this.goal1Content.measure ? this.goal1Content.measure.trim() : undefined
        };
        this.goal1Contents.push(newGoal1Content);
        this.goal1Content = {};
        document.getElementById('goal1ContentPlan').focus();
        break;
      case 'goal2':
        if (!this.goal2Content.plan.trim()) return;
        let newGoal2Content = {
          plan: this.goal2Content.plan.trim(),
          date: this.goal2Content.date ? this.goal2Content.date.trim() : undefined,
          measure: this.goal2Content.measure ? this.goal2Content.measure.trim() : undefined
        };
        this.goal2Contents.push(newGoal2Content);
        this.goal2Content = {};
        document.getElementById('goal2ContentPlan').focus();
        break;
      case 'goal3':
        if (!this.goal3Content.plan.trim()) return;
        let newGoal3Content = {
          plan: this.goal3Content.plan.trim(),
          date: this.goal3Content.date ? this.goal3Content.date.trim() : undefined,
          measure: this.goal3Content.measure ? this.goal3Content.measure.trim() : undefined
        };
        this.goal3Contents.push(newGoal3Content);
        this.goal3Content = {};
        document.getElementById('goal3ContentPlan').focus();
        break;
      case 'goal4':
        if (!this.goal4Content.plan.trim()) return;
        let newGoal4Content = {
          plan: this.goal4Content.plan.trim(),
          date: this.goal4Content.date ? this.goal4Content.date.trim() : undefined,
          measure: this.goal4Content.measure ? this.goal4Content.measure.trim() : undefined
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
    if (this.smartGoalApproval.Goal1 > 0) noGoals++;
    if (this.smartGoalApproval.Goal2 > 0) noGoals++;
    if (this.smartGoalApproval.Goal3 > 0) noGoals++;
    if (this.smartGoalApproval.Goal4 > 0) noGoals++;
    this.smartGoalApproval.TotalScore = (noGoals == 0) ? 0 : (this.smartGoalApproval.Goal1 + this.smartGoalApproval.Goal2 + this.smartGoalApproval.Goal3 + this.smartGoalApproval.Goal4) / noGoals;
  }
  // End of Total Score

  uncheckGoal(name: string) {
    // alert('b')
    switch (name) {
      case 'goal1':
        this.smartGoalApproval.Goal1 = 0; this.generateTotalScore(); break;
      case 'goal2':
        this.smartGoalApproval.Goal2 = 0; this.generateTotalScore(); break;
      case 'goal3':
        this.smartGoalApproval.Goal3 = 0; this.generateTotalScore(); break;
      case 'goal4':
        this.smartGoalApproval.Goal4 = 0; this.generateTotalScore(); break;
      default: return;
    }
  }

  addPersonalDevelopmentContent(): void {
    if (!this.personalDevelopmentContent.plan) return;
    let newPersonalDevelopmentContent = {
      plan: this.personalDevelopmentContent.plan.trim(),
      date: this.personalDevelopmentContent.date ? this.personalDevelopmentContent.date.trim() : undefined,
      measure: this.personalDevelopmentContent.measure ? this.personalDevelopmentContent.measure.trim() : undefined
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

  removePersonalDevelopment() {
    this.personalDevelopmentContents = [];
    this.personalDevelopmentContent = {};
  }

  exportApprovalIndexToExcel() {
    let exportExcelPromise = new Promise((Resolve, Reject) => {
      this._dataService.post('/api/SmartGoal/ApprovalListToExcel', JSON.stringify(this.search)).subscribe((response: any) => {
        window.open(SystemConstants.BASE_API + response);
        // Resolve(response);
        setTimeout(() => Resolve(response), 300000);
      }, error => this._handleErrorService.handleError(error));
    });
    exportExcelPromise.then((element) => this._dataService.delete('/api/Report/deleteReportFile', 'reportPath', element.toString()).subscribe((response: Response) => { }));
  }

  clearSearch() {
    let dateNow: Date = new Date(Date.now());
    this.search.FromYear = dateNow.getFullYear();
    this.search.ToYear = dateNow.getFullYear();
    this.search.DepartmentId = 'All';
    this.search.StatusId = 'All'

    this.search.EmployeeId = '';
    this.search.EmployeeName = '';
    this.search.EmployeeTitle = '';
  }
}
