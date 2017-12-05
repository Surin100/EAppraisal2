import { Component, OnInit } from '@angular/core';

import { IMyDpOptions } from 'mydatepicker';

import { AuthenService } from '../../../core/services/authen.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LoggedInUser } from '../../../core/domain/loggedin.user';
import { DataService } from '../../../core/services/data.service';
import { SystemConstants } from '../../../core/common/system.constants';
import { HandleErrorService } from '../../../core/services/handle-error.service';

@Component({
  selector: 'summary-performance-appraisal',
  templateUrl: './summary-performance-appraisal.component.html',
  styleUrls: ['./summary-performance-appraisal.component.css']
})
export class SummaryPerformanceAppraisalComponent implements OnInit {
  currentUser: LoggedInUser;
  summaryPerformanceAppraisal: any = {};
  departmentList = [];
  companyHRList = [];
  exportExcelLoading: Boolean = false;
  summaryPerformanceAppraisalFromActive: Boolean = true;
  summaryPerformanceAppraisalFrom;
  summaryPerformanceAppraisalTo;
  myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
  };
  private today = new Date();
  constructor(private _authenService: AuthenService, private _dataService: DataService,
    private _handleErrorService: HandleErrorService, private _notificationService: NotificationService) {
    this.currentUser = _authenService.getLoggedInUser();
  }

  ngOnInit() {
    this.summaryPerformanceAppraisalTo = { date: { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() } };
    this.departmentList = JSON.parse(this.currentUser.departmentList);
    // console.log(this.departmentList);
    this.departmentList.push({Disabled: false, Group: null, Selected: true, Text: "All", Value: undefined});
    this.companyHRList = JSON.parse(this.currentUser.companyHRList);
    this.summaryPerformanceAppraisal.CompanyId = this.companyHRList[0].Value;
  }

  exportExcel() {
    if(!this.summaryPerformanceAppraisalFrom){
      this._notificationService.printErrorMessage("From date is required.");
      return;
    }

    if(!this.summaryPerformanceAppraisalTo){
      this._notificationService.printErrorMessage("To date is required.");
      return;
    }

    let _fromMonth = this.summaryPerformanceAppraisalFrom.date.month.toString().length < 2 ? '0' + this.summaryPerformanceAppraisalFrom.date.month : this.summaryPerformanceAppraisalFrom.date.month;
    let _fromDay = this.summaryPerformanceAppraisalFrom.date.day.toString().length < 2 ? '0' + this.summaryPerformanceAppraisalFrom.date.day : this.summaryPerformanceAppraisalFrom.date.day;
    let _fromDate: string = this.summaryPerformanceAppraisalFrom.date.year + '-' + _fromMonth + '-' + _fromDay + 'T12:00:00Z'
    let summaryFrom = new Date(_fromDate);

    let _toMonth = this.summaryPerformanceAppraisalTo.date.month.toString().length < 2 ? '0' + this.summaryPerformanceAppraisalTo.date.month : this.summaryPerformanceAppraisalTo.date.month;
    let _toDay = this.summaryPerformanceAppraisalTo.date.day.toString().length < 2 ? '0' + this.summaryPerformanceAppraisalTo.date.day : this.summaryPerformanceAppraisalTo.date.day;
    let _toDate: string = this.summaryPerformanceAppraisalTo.date.year + '-' + _toMonth + '-' + _toDay + 'T12:00:00Z'
    let summaryTo = new Date(_toDate);

    if(summaryFrom > summaryTo){
      this._notificationService.printErrorMessage("To Date should be larger than From Date.");
      return;
    }

    let exportExcelPromise = new Promise((Resolve, Reject) => {
      // alert(JSON.stringify(this.summaryPerformanceAppraisal));
      // Date problem
      let _fromMonth = this.summaryPerformanceAppraisalFrom.date.month.toString().length < 2 ? '0' + this.summaryPerformanceAppraisalFrom.date.month : this.summaryPerformanceAppraisalFrom.date.month;
      let _fromDay = this.summaryPerformanceAppraisalFrom.date.day.toString().length < 2 ? '0' + this.summaryPerformanceAppraisalFrom.date.day : this.summaryPerformanceAppraisalFrom.date.day;
      let _fromDate: string = this.summaryPerformanceAppraisalFrom.date.year + '-' + _fromMonth + '-' + _fromDay + 'T12:00:00Z'
      this.summaryPerformanceAppraisal.From = new Date(_fromDate);

      let _toMonth = this.summaryPerformanceAppraisalTo.date.month.toString().length < 2 ? '0' + this.summaryPerformanceAppraisalTo.date.month : this.summaryPerformanceAppraisalTo.date.month;
      let _toDay = this.summaryPerformanceAppraisalTo.date.day.toString().length < 2 ? '0' + this.summaryPerformanceAppraisalTo.date.day : this.summaryPerformanceAppraisalTo.date.day;
      let _toDate: string = this.summaryPerformanceAppraisalTo.date.year + '-' + _toMonth + '-' + _toDay + 'T12:00:00Z'
      this.summaryPerformanceAppraisal.To = new Date(_toDate);
      // End Date problem

      this._dataService.post('/api/Report/SummaryPerformanceAppraisal', this.summaryPerformanceAppraisal).subscribe((response: any) => {
        window.open(SystemConstants.BASE_API + response);
        setTimeout(()=> Resolve(response),300000);
      }, error => {
        // alert(JSON.stringify(error));
        this._handleErrorService.handleError(error);
      })
    });
    exportExcelPromise.then((element) => this._dataService.delete('/api/Report/deleteReportFile', 'reportPath', element.toString()).subscribe((response: Response) => { }));
  }

  clearFilter(){
    this.summaryPerformanceAppraisalFromActive = false;
    this.summaryPerformanceAppraisalFrom = undefined;
    this.summaryPerformanceAppraisal.DepartmentId = undefined;
    this.summaryPerformanceAppraisalTo = { date: { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() } };
    this.departmentList = JSON.parse(this.currentUser.departmentList);
    this.summaryPerformanceAppraisal.CompanyId = this.companyHRList[0].Value;
    setTimeout(() => {this.summaryPerformanceAppraisalFromActive = true}, 1 );
  }
}
