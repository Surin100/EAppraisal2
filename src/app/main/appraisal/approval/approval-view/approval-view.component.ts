import { Component, OnInit } from '@angular/core';

import { DataService } from '../../../../core/services/data.service';
import { HandleErrorService } from '../../../../core/services/handle-error.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { ApprovalComponent} from '../approval.component';

@Component({
  selector: 'app-approval-view',
  templateUrl: './approval-view.component.html',
  styleUrls: ['./approval-view.component.css']
})
export class ApprovalViewComponent implements OnInit {
  appraisal:any ={};
  constructor(private _dataService: DataService, private _handleErrorService: HandleErrorService, private _utilityService : UtilityService,
    private _approvalComponent: ApprovalComponent) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(){
  //   // alert(this._approvalComponent.viewAppraisalId);
  //   this._dataService.get('/api/appraisal/getAppraisal/' + this._approvalComponent.viewAppraisalId).subscribe((response: any)=>{
  //     // alert(response);
  //     this.appraisal = response;
  //   }, error => {
  //     // alert(JSON.stringify(error));
  //     this._handleErrorService.handleError(error);
  //     this._utilityService.navigate('/main/appraisal/approval');
  //   });
  }

  showApproveModal(appraisalId:number){
    
  }
}
