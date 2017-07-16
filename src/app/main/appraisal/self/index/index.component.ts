import { Component, OnInit } from '@angular/core';

import { DataService } from '../../../../core/services/data.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  pageIndex:number = 1;
  pageSize:number = 5;
  totalRow:number;
  filter:string = '';
  pageDisplay:number = 10;
  appraisals:any[];
  constructor(private _dataService: DataService) {
    
   }

  ngOnInit() {
    this.loadData();
  }

  loadData(){
    this._dataService.get('/api/appraisal/getlistpaging?page='+this.pageIndex + '&pagesize='+this.pageSize+'&filter='+this.filter)
    .subscribe((response:any)=>{
      this.appraisals = response.Items;
      // console.log(response);
      this.pageIndex = response.PageIndex;
      this.pageSize = response.PageSize;
      this.totalRow = response.TotalRows;
    },error=>this._dataService.handleError(error));
  }
  pageChanged(event:any):void{
    // debugger
    this.pageIndex = event.page;
    this.loadData();
  }
}
