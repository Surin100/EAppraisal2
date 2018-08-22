import { Component, OnInit, ViewChild } from '@angular/core';

// import { IMyDpOptions } from 'mydatepicker';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { DataService } from '../../../core/services/data.service';
import { LoggedInUser } from '../../../core/domain/loggedin.user';
import { AuthenService } from '../../../core/services/authen.service';
import { HandleErrorService } from '../../../core/services/handle-error.service';
import {SystemConstants} from '../../../core/common/system.constants';

@Component({
  selector: 'app-approved-goal',
  templateUrl: './approved-goal.component.html',
  styleUrls: ['./approved-goal.component.css']
})
export class ApprovedGoalComponent implements OnInit {
  @ViewChild('approvedSmartGoalModal') approvedSmartGoalModal: ModalDirective;
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRow: number;
  filter: string = '';
  maxSize: number = 10;
  currentUser: LoggedInUser;
  departmentList;
  categoryList;
  approvedGoalList: any = [];
  smartGoalApproval: any = {};
  goal1Contents: any = [];
  goal2Contents: any = [];
  goal3Contents: any = [];
  goal4Contents: any = [];
  smartGoalApprovalFrom;
  smartGoalApprovalTo;
  smartGoalApprovalReviewDate;
  personalDevelopmentContents: any = [];

  departmentSearchList = [];
  statusSearchList = [];
  search: any = {};

  constructor(private _dataService: DataService, private _authenService: AuthenService, private _handleErrorService: HandleErrorService) {
  }

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

    this.loadData();
  }

  // private myDatePickerOptions: IMyDpOptions = {
  //   // other options...
  //   dateFormat: 'dd/mm/yyyy',
  // };

  loadData() {
    if(this.search.EmployeeId === undefined) this.search.EmployeeId = '';
    if(this.search.EmployeeName === undefined) this.search.EmployeeName = '';
    if(this.search.EmployeeTitle === undefined) this.search.EmployeeTitle = '';
    this._dataService.get('/api/SmartGoalApproval/GetApprovedListPaging?pageIndex=' + this.pageIndex + '&pagesize=' + this.pageSize +
      '&employeeId=' + this.search.EmployeeId + '&employeeName=' + this.search.EmployeeName + '&departmentId=' + this.search.DepartmentId +
      '&employeeTitle=' + this.search.EmployeeTitle + '&statusId=' + this.search.StatusId + 
      '&fromYear=' + this.search.FromYear + '&toYear=' + this.search.ToYear)
      .subscribe((response: any) => {
        this.approvedGoalList = response.Items;
        this.approvedGoalList.forEach(element => {
          element.StatusName = JSON.parse(this.currentUser.statusList).filter(a => a.Value == element.StatusId)[0].Text;
        });
        // console.log(response);
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.totalRow = response.TotalRow;
      }, error => this._handleErrorService.handleError(error));
  }

  pageChanged(event) {
    this.pageIndex = event.page;
    this.loadData();
  }

  showApprovedSmartGoalModal(Id) {
    this.loadSmartGoalApproval(Id);
    this.approvedSmartGoalModal.show();

  }

  loadSmartGoalApproval(Id) {
    this._dataService.get('/api/SmartGoalApproval/getSmartGoalApproval/' + Id).subscribe((response: any) => {
      this.smartGoalApproval = response;
      // console.log(response);
      this.smartGoalApproval.DepartmentEnName = JSON.parse(this.currentUser.departmentList).filter(d => d.Value == response.DepartmentId)[0].Text;
      this.smartGoalApproval.categoryName = JSON.parse(this.currentUser.categoryList).filter(c => c.Value == response.CategoryId)[0].Text;
      let fromDate = new Date(response.From);
      this.smartGoalApprovalFrom = fromDate.getDate() + '/' + (fromDate.getMonth() + 1) + '/' + fromDate.getFullYear();
      let toDate = new Date(response.To);
      this.smartGoalApprovalTo = toDate.getDate() + '/' + (toDate.getMonth() + 1) + '/' + toDate.getFullYear();
      let reviewDate = new Date(response.ReviewDate)
      this.smartGoalApprovalReviewDate = reviewDate.getDate() + '/' + (reviewDate.getMonth() + 1) + '/' + reviewDate.getFullYear();
      this.goal1Contents = JSON.parse(response.Goal1Content);
      this.goal2Contents = JSON.parse(response.Goal2Content);
      this.goal3Contents = JSON.parse(response.Goal3Content);
      this.goal4Contents = JSON.parse(response.Goal4Content);
      this.personalDevelopmentContents = JSON.parse(response.PersonalDevelopmentContent);
    }, error => {
      // alert(JSON.stringify(error));
      this._handleErrorService.handleError(error);
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

    // if (this.goal1Content.plan) this.goal1Contents.push(this.goal1Content);
    // if (this.goal2Content.plan) this.goal2Contents.push(this.goal2Content);
    // if (this.goal3Content.plan) this.goal3Contents.push(this.goal3Content);
    // if (this.goal4Content.plan) this.goal4Contents.push(this.goal4Content);
    // if (this.personalDevelopmentContent.plan) this.personalDevelopmentContents.push(this.personalDevelopmentContent);

    // this.goal1Content = {};
    // this.goal2Content = {};
    // this.goal3Content = {};
    // this.goal4Content = {};
    // this.personalDevelopmentContent={};

    // this.smartGoalApproval.goal1Content = JSON.stringify(this.goal1Contents);
    // this.smartGoalApproval.goal2Content = JSON.stringify(this.goal2Contents);
    // this.smartGoalApproval.goal3Content = JSON.stringify(this.goal3Contents);
    // this.smartGoalApproval.goal4Content = JSON.stringify(this.goal4Contents);
    // this.smartGoalApproval.personalDevelopmentContent = JSON.stringify(this.personalDevelopmentContents);

    // this.smartGoal.departmentEnName = JSON.parse(this.currentUser.departmentList).filter(c => c.Value == this.smartGoal.departmentId)[0].Text;

    let exportExcelPromise = new Promise((Resolve, Reject)=>{
      this._dataService.post('/api/SmartGoal/exportExcel', JSON.stringify(this.smartGoalApproval)).subscribe((response: any) => {
        window.open(SystemConstants.BASE_API + response);
        
        // Resolve(response);
        setTimeout(()=> Resolve(response),300000);
      }, error => {
        this._handleErrorService.handleError(error);
      });
    });
    exportExcelPromise.then((element)=>{
      this._dataService.delete('/api/Report/deleteReportFile', 'reportPath', element.toString()).subscribe((response: Response) => { });
    });
  }

  exportApprovedIndexToExcel(){
    // console.log(this.exportIndex);
    let exportExcelPromise = new Promise((Resolve, Reject) => {
      this._dataService.post('/api/SmartGoalApproval/ApprovedListToExcel', JSON.stringify(this.search)).subscribe((response: any)=>{
        window.open(SystemConstants.BASE_API + response);
        // Resolve(response);
        setTimeout(()=> Resolve(response),300000);
    }, error => this._handleErrorService.handleError(error));
  });
  exportExcelPromise.then((element) => this._dataService.delete('/api/Report/deleteReportFile', 'reportPath', element.toString()).subscribe((response: Response) => { }));
  }

  clearSearch(){
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
