import { Component, OnInit, ViewChild } from '@angular/core';

import { IMyDpOptions } from 'mydatepicker';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AuthenService } from '../../../core/services/authen.service';
import { DataService } from '../../../core/services/data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { HandleErrorService } from '../../../core/services/handle-error.service';
import { UtilityService } from '../../../core/services/utility.service';
import { LoggedInUser } from '../../../core/domain/loggedin.user';
import { MessageConstants } from '../../../core/common/message.constants';
import { UrlConstants } from '../../../core/common/url.constants';

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
  appraisal: any;
  appraisalApproval: any;
  currentUser: LoggedInUser;
  departmentList = [];
  categoryList = [];
  temporarydate;


  constructor(private _authenService: AuthenService, private _dataService: DataService, private _handleErrorService: HandleErrorService,
    private _utilityService: UtilityService, private _notificationService: NotificationService
  ) {
  }

  private myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
  };

  ngOnInit() {
    this.currentUser = this._authenService.getLoggedInUser();
    this.loadData();
  }

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

  loadAppraisal(Id: any) {
    this._dataService.get('/api/appraisal/getAppraisal/' + Id).subscribe((response: any) => {
      // alert(JSON.stringify(this.currentUser.categoryList) + JSON.stringify(this.appraisal.categoryId));
      this.appraisal = {};
      this.appraisalApproval ={};
      this.appraisal = response;
      this.appraisalApproval.reviewerName = this.currentUser.fullName;
      this.appraisalApproval.reviewerTitle = this.currentUser.jobTitle;
      this.appraisal.departmentEnName = JSON.parse(this.currentUser.departmentList).filter(a => a.Value == this.appraisal.DepartmentId)[0].Text;
      this.appraisal.categoryName = JSON.parse(this.currentUser.categoryList).filter(a => a.Value == this.appraisal.CategoryId)[0].Text;
      let fromDate = new Date(this.appraisal.From);
      this.appraisal.From = fromDate.getDate() + '/' + (fromDate.getMonth() + 1) + '/' + fromDate.getFullYear();
      let toDate = new Date(this.appraisal.To);
      this.appraisal.To = toDate.getDate() + '/' + (toDate.getMonth() + 1) + '/' + toDate.getFullYear();
      let reviewDate = new Date(this.appraisal.ReviewDate)
      this.temporarydate = { date: { year: reviewDate.getFullYear(), month: reviewDate.getMonth() + 1, day: reviewDate.getDate() } };

      // alert(this.appraisal.From);
    }, error => this._handleErrorService.handleError(error));
  }

  showApproveAppraisalModal(appraisalId: number) {
    this.loadAppraisal(appraisalId);
    this.approveAppraisalModal.show();

  }

  approveAppraisal(valid: Boolean) {
    if (!valid || this.appraisal.Id == undefined) return;
    
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
    this.appraisalApproval.appraisalId = this.appraisal.Id;
    this.appraisalApproval.companyId = this.appraisal.CompanyId;
    this.appraisalApproval.DepartmentId = this.appraisal.DepartmentId;
    this.appraisalApproval.UserId = this.appraisal.UserId;
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
}



