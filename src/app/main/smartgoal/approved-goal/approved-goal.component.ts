import { Component, OnInit, ViewChild } from '@angular/core';

// import { IMyDpOptions } from 'mydatepicker';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { DataService } from '../../../core/services/data.service';
import { LoggedInUser } from '../../../core/domain/loggedin.user';
import { AuthenService } from '../../../core/services/authen.service';
import { HandleErrorService } from '../../../core/services/handle-error.service';

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
  personalDevelopmentContents: any = [];

  constructor(private _dataService: DataService, private _authenService: AuthenService, private _handleErrorService: HandleErrorService) {
    this.currentUser = _authenService.getLoggedInUser();
  }

  ngOnInit() {
    this.departmentList = JSON.parse(this.currentUser.departmentList);
    this.categoryList = JSON.parse(this.currentUser.categoryList);
    this.loadData();
  }

  // private myDatePickerOptions: IMyDpOptions = {
  //   // other options...
  //   dateFormat: 'dd/mm/yyyy',
  // };

  loadData() {
    this._dataService.get('/api/SmartGoalApproval/GetApprovedListPaging?pageIndex=' + this.pageIndex + '&pagesize=' + this.pageSize + '&filter=' + this.filter)
      .subscribe((response: any) => {
        this.approvedGoalList = response.Items;
        this.approvedGoalList.forEach(element => {
          element.StatusName = element.StatusId == 'V' ? 'Rejected' : 'Approved';
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

  showApprovedSmartGoalModal(Id) {
    this.loadSmartGoalApproval(Id);
    this.approvedSmartGoalModal.show();

  }

  loadSmartGoalApproval(Id) {
    this._dataService.get('/api/SmartGoalApproval/getSmartGoalApproval/' + Id).subscribe((response: any) => {
      this.smartGoalApproval = response;
      // console.log(response);
      this.smartGoalApproval.departmentEnName = JSON.parse(this.currentUser.departmentList).filter(d => d.Value == response.DepartmentId)[0].Text;
      this.smartGoalApproval.categoryName = JSON.parse(this.currentUser.categoryList).filter(c => c.Value == response.CategoryId)[0].Text;
      let fromDate = new Date(response.From);
      this.smartGoalApproval.From = fromDate.getDate() + '/' + (fromDate.getMonth() + 1) + '/' + fromDate.getFullYear();
      let toDate = new Date(response.To);
      this.smartGoalApproval.To = toDate.getDate() + '/' + (toDate.getMonth() + 1) + '/' + toDate.getFullYear();
      let reviewDate = new Date(response.ReviewDate)
      this.smartGoalApproval.ReviewDate = reviewDate.getDate() + '/' + (reviewDate.getMonth() + 1) + '/' + reviewDate.getFullYear();
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
}
