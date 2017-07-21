import { Component, OnInit } from '@angular/core';

import { AuthenService } from '../../../../core/services/authen.service';
import { DataService } from '../../../../core/services/data.service';
import { HandleErrorService } from '../../../../core/services/handle-error.service';

@Component({
  selector: 'app-approval-index',
  templateUrl: './approval-index.component.html',
  styleUrls: ['./approval-index.component.css']
})
export class ApprovalIndexComponent implements OnInit {
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRow: number;
  filter: string = '';
  maxSize: number = 10;
  appraisals:any[];

  constructor(private _authenService:AuthenService, private _dataService:DataService, private _handleErrorService: HandleErrorService) {
  }

  ngOnInit() {
    this.loadData();
  }

   loadData() {
    this._dataService.get('/api/appraisal/GetNeedYourAppraisalApprovalListPaging?pageIndex=' + this.pageIndex + '&pagesize=' + this.pageSize + '&filter=' + this.filter)
      .subscribe((response: any) => {
        this.appraisals = response.Items;
        console.log(response);
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


}
