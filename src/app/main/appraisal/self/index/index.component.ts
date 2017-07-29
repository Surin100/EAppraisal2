import { Component, OnInit } from '@angular/core';

import { HandleErrorService } from '../../../../core/services/handle-error.service';
import { DataService } from '../../../../core/services/data.service';
import { AuthenService } from '../../../../core/services/authen.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { MessageConstants } from '../../../../core/common/message.constants';
import { LoggedInUser } from '../../../../core/domain/loggedin.user';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRow: number;
  filter: string = '';
  maxSize: number = 10;
  appraisals: any[];
  deleteAppraisalLoading:Boolean = false;
  currentUser: LoggedInUser;

  constructor(private _handleErrorService: HandleErrorService, private _dataService: DataService, private _notificationService: NotificationService,
    private _authenService: AuthenService) {
  }

  ngOnInit() {
    this.currentUser = this._authenService.getLoggedInUser();
    this.loadData();
  }

  loadData() {
    this._dataService.get('/api/appraisal/getlistpaging?pageIndex=' + this.pageIndex + '&pagesize=' + this.pageSize + '&filter=' + this.filter)
      .subscribe((response: any) => {
        this.appraisals = response.Items;
        this.appraisals.forEach(element => {
          element.statusName = JSON.parse(this.currentUser.statusList).filter(s => s.Value == element.StatusId)[0].Text;
          element.categoryName = JSON.parse(this.currentUser.categoryList).filter(s => s.Value == element.CategoryId)[0].Text;
        });
        // console.log(response);
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

  deleteAppraisal(id:string){
    this.deleteAppraisalLoading = true;
    this._notificationService.printConfirmationDialog(MessageConstants.CONFIRM_DELETE_MSG, () =>{
      this.deleteAppraisalConfirm(id);
    });
    
  }

  deleteAppraisalConfirm(id:string){
    this._dataService.delete('/api/appraisal/delete','id',id).subscribe((response:any)=>{
      this.loadData();
      this._notificationService.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
      this.deleteAppraisalLoading = false;
    },error => {
      this._handleErrorService.handleError(error);
      this.deleteAppraisalLoading = false;
    });
  }
}
