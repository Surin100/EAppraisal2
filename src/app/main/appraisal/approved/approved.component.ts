import { Component, OnInit, ViewChild } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { DataService } from '../../../core/services/data.service';
import { HandleErrorService } from '../../../core/services/handle-error.service';
import { AuthenService } from '../../../core/services/authen.service';
import { LoggedInUser } from '../../../core/domain/loggedin.user';

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
        element.StatusName = element.StatusId == 'V' ? 'Rejected' : 'Approved';
      });
    });
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
      this.appraisalApproval.From = fromDate.getDate() + '/' + (fromDate.getMonth() + 1) + '/' + fromDate.getFullYear();
      let toDate = new Date(this.appraisalApproval.To);
      this.appraisalApproval.To = toDate.getDate() + '/' + (toDate.getMonth() + 1) + '/' + toDate.getFullYear();
      let reviewDate = new Date(this.appraisalApproval.ReviewDate)
      this.appraisalApproval.ReviewDate = reviewDate.getDate()+'/'+ (reviewDate.getMonth()+1) + '/' + reviewDate.getFullYear();
      

    }, error => this._handleErrorService.handleError(error));
  }

  showApprovedAppraisal(Id) {
    this.loadAppraisalApproval(Id);
    this.approvedAppraisalModal.show();
  }
}
