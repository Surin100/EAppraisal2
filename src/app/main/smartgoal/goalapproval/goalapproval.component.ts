import { Component, OnInit, ViewChild } from '@angular/core';

import { IMyDpOptions } from 'mydatepicker';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { DataService } from '../../../core/services/data.service';
import { AuthenService } from '../../../core/services/authen.service';
import { LoggedInUser } from '../../../core/domain/loggedin.user';
import { HandleErrorService } from '../../../core/services/handle-error.service';

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
  smartGoal: any;
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

  constructor(private _dataService: DataService, private _authenService: AuthenService, private _handleErrorService: HandleErrorService) {
    this.currentUser = _authenService.getLoggedInUser();
  }

  ngOnInit() {
    this.departmentList = JSON.parse(this.currentUser.departmentList);
    this.categoryList = JSON.parse(this.currentUser.categoryList);
    this.loadData()
  }

  private myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
  };

  loadData() {
    this._dataService.get('/api/SmartGoal/GetNeedYourSmartGoalApprovalListPaging?pageIndex=' + this.pageIndex + '&pagesize=' + this.pageSize + '&filter=' + this.filter)
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

  showApproveSmartGoalModal(Id) {
    this.loadSmartGoal(Id);
    this.approveSmartGoalModal.show();
  }

  loadSmartGoal(Id) {
    this.goal1Content = {};
    this.goal2Content = {};
    this.goal3Content = {};
    this.goal4Content = {};
    this.personalDevelopmentContent = {};

    this._dataService.get('/api/SmartGoal/getSmartGoal/' + Id).subscribe((response: any) => {
      this.smartGoal = response;
      this.smartGoal.Reviewer = this.currentUser.fullName;
      this.smartGoal.ReviewerTitle = this.currentUser.jobTitle;
      // console.log(this.smartGoal);
      this.smartGoal.departmentEnName = JSON.parse(this.currentUser.departmentList).filter(a => a.Value == this.smartGoal.DepartmentId)[0].Text;
      this.smartGoal.categoryName = JSON.parse(this.currentUser.categoryList).filter(a => a.Value == this.smartGoal.CategoryId)[0].Text;
      let fromDate = new Date(response.From);
      this.smartGoalFrom = fromDate.getDate() +'/'+ (fromDate.getMonth() + 1) +'/'+ fromDate.getFullYear();
      let toDate = new Date(response.To);
      this.smartGoalTo =  toDate.getDate() +'/'+ (toDate.getMonth() + 1) +'/'+ toDate.getFullYear();
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
}
