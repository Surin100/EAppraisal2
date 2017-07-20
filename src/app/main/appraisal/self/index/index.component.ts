import { Component, OnInit } from '@angular/core';

import { HandleErrorService } from '../../../../core/services/handle-error.service';
import { DataService } from '../../../../core/services/data.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { MessageConstants } from '../../../../core/common/message.constants';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  pageIndex: number = 1;
  pageSize: number = 5;
  totalRow: number;
  filter: string = '';
  pageDisplay: number = 10;
  appraisals: any[];
  deleteAppraisalLoading:Boolean = false;
  constructor(private _handleErrorService: HandleErrorService, private _dataService: DataService, private _notificationService: NotificationService) {
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this._dataService.get('/api/appraisal/getlistpaging?pageIndex=' + this.pageIndex + '&pagesize=' + this.pageSize + '&filter=' + this.filter)
      .subscribe((response: any) => {
        this.appraisals = response.Items;
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
