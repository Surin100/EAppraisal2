import { Component, OnInit, ViewChild } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { DataService } from '../../../core/services/data.service';
import { HandleErrorService } from '../../../core/services/handle-error.service';
import { AuthenService } from '../../../core/services/authen.service';
import { LoggedInUser } from '../../../core/domain/loggedin.user';
import { SystemConstants } from '../../../core/common/system.constants';

@Component({
  selector: 'app-approved',
  templateUrl: './approved.component.html',
  styleUrls: ['./approved.component.css']
})
export class ApprovedComponent implements OnInit {
  @ViewChild('approvedAppraisalModal') public approvedAppraisalModal: ModalDirective;
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRow: number;
  filter: string = '';
  maxSize: number = 10;
  approvedList: any[];
  appraisalApproval: any = {};
  currentUser: LoggedInUser;
  appraisalApprovalFrom;
  appraisalApprovalTo;
  appraisalApprovalReviewDate;
  exportIndex: any = {};

  constructor(private _dataService: DataService, private _authenService: AuthenService, private _handleErrorService: HandleErrorService) { }

  ngOnInit() {
    this.currentUser = this._authenService.getLoggedInUser();
    this.loadData();
  }

  loadData() {
    this._dataService.get('/api/AppraisalApproval/GetApprovedListPaging?pageIndex=' + this.pageIndex + '&pagesize=' + this.pageSize + '&filter=' + this.filter).subscribe((response) => {
      // console.log(response);
      this.approvedList = response.Items;
      this.approvedList.forEach(element => {
        element.StatusName = JSON.parse(this.currentUser.statusList).filter(a => a.Value == element.StatusId)[0].Text;
      });
      this.pageIndex = response.PageIndex;
      this.pageSize = response.PageSize;
      this.totalRow = response.TotalRow;
    },error => this._handleErrorService.handleError(error));
  }

  pageChanged(event: any): void {
    // debugger
    this.pageIndex = event.page;
    this.loadData();
  }

  loadAppraisalApproval(Id) {
    this._dataService.get('/api/AppraisalApproval/getAppraisalApproval/' + Id).subscribe((response: any) => {
      this.appraisalApproval = response;
      // console.log(this.appraisalApproval);
      this.appraisalApproval.departmentEnName = JSON.parse(this.currentUser.departmentList).filter(d => d.Value == this.appraisalApproval.DepartmentId)[0].Text;
      this.appraisalApproval.categoryName = JSON.parse(this.currentUser.categoryList).filter(c => c.Value == this.appraisalApproval.CategoryId)[0].Text;
      let fromDate = new Date(this.appraisalApproval.From);
      this.appraisalApprovalFrom = fromDate.getDate() + '/' + (fromDate.getMonth() + 1) + '/' + fromDate.getFullYear();
      let toDate = new Date(this.appraisalApproval.To);
      this.appraisalApprovalTo = toDate.getDate() + '/' + (toDate.getMonth() + 1) + '/' + toDate.getFullYear();
      let reviewDate = new Date(this.appraisalApproval.ReviewDate);
      this.appraisalApprovalReviewDate = reviewDate.getDate() + '/' + (reviewDate.getMonth() + 1) + '/' + reviewDate.getFullYear();

    }, error => this._handleErrorService.handleError(error));
  }

  showApprovedAppraisal(Id) {
    this.loadAppraisalApproval(Id);
    this.approvedAppraisalModal.show();
  }

  exportExcel(valid: Boolean) {
    if(valid === false) return;
    //  alert(JSON.stringify(this.appraisalFrom));
    // Date problem
    // let _appraisalMonth = this.temporarydate.date.month.toString().length < 2 ? '0' + this.temporarydate.date.month : this.temporarydate.date.month;
    // let _appraisalDay = this.temporarydate.date.day.toString().length < 2 ? '0' + this.temporarydate.date.day : this.temporarydate.date.day;
    // let _reviewDate: string = this.temporarydate.date.year + '-' + _appraisalMonth + '-' + _appraisalDay + 'T12:00:00Z'
    // this.appraisalApproval.reviewDate = new Date(_reviewDate);

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

  exportApprovedIndexToExcel(){
    let exportExcelPromise = new Promise((Resolve, Reject) => {
      this._dataService.post('/api/AppraisalApproval/ApprovedListToExcel', JSON.stringify(this.exportIndex)).subscribe((response: any)=>{
        window.open(SystemConstants.BASE_API + response);
        // Resolve(response);
        setTimeout(()=> Resolve(response),300000);
    }, error => this._handleErrorService.handleError(error));
  });
  exportExcelPromise.then((element) => this._dataService.delete('/api/Report/deleteReportFile', 'reportPath', element.toString()).subscribe((response: Response) => { }));
  }
}
