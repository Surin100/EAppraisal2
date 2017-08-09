import { Component, OnInit } from '@angular/core';

import { IMyDpOptions } from 'mydatepicker';

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
  approveLoading: Boolean = false;
  pageIndex: number = 1;
  pageSize: number = 1;
  totalRow: number;
  filter: string = '';
  maxSize: number = 10;
  smartGoals: any[];
  smartGoal: any;
  currentUser: LoggedInUser;

  constructor(private _dataService: DataService, private _authenService: AuthenService, private _handleErrorService: HandleErrorService) {
    this.currentUser = _authenService.getLoggedInUser();
   }

  ngOnInit() {
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

  pageChanged(event){
    this.pageIndex = event.page;
    this.loadData();
  }
}
