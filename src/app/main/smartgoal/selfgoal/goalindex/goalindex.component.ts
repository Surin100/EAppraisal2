import { Component, OnInit } from '@angular/core';

import { DataService } from '../../../../core/services/data.service';
import { AuthenService } from '../../../../core/services/authen.service';
import { HandleErrorService } from '../../../../core/services/handle-error.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { LoggedInUser } from '../../../../core/domain/loggedin.user';
import { MessageConstants } from '../../../../core/common/message.constants';

@Component({
  selector: 'app-goalindex',
  templateUrl: './goalindex.component.html',
  styleUrls: ['./goalindex.component.css']
})

export class GoalIndexComponent implements OnInit {
  smartGoals = [];
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRow: number;
  filter: string = '';
  maxSize: number = 10;
  currentUser: LoggedInUser;
  departmentList;
  categoryList;
  deleteSmartGoalLoading:Boolean;
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
        this.smartGoals.forEach(element => {
          element.statusName = JSON.parse(this.currentUser.statusList).filter(s => s.Value == element.StatusId)[0].Text;
          element.categoryName = JSON.parse(this.currentUser.categoryList).filter(s => s.Value == element.CategoryId)[0].Text;
        });
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.totalRow = response.TotalRow;
      }, error => {
        alert(error);
        this._handleErrorService.handleError(error);
      });
  }

  deleteSmartGoal(id: string) {
    this.deleteSmartGoalLoading = true;
    this._notificationService.printConfirmationDialog(MessageConstants.CONFIRM_DELETE_MSG, () => {
      this.deleteSmartGoalConfirm(id);
    });
  }

  deleteSmartGoalConfirm(id){
     this._dataService.delete('/api/SmartGoal/delete', 'id', id).subscribe((response: any) => {
      this.loadData();
      this._notificationService.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
      this.deleteSmartGoalLoading = false;
    }, error => {
      this._handleErrorService.handleError(error);
      this.deleteSmartGoalLoading = false;
    });
  };
}
