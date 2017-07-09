import { Component, OnInit } from '@angular/core';

import { IMyDpOptions } from 'mydatepicker';

import { AuthenService } from '../../../../core/services/authen.service';
import { LoggedInUser } from '../../../../core/domain/loggedin.user';
import { DataService } from '../../../../core/services/data.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { MessageConstants } from '../../../../core/common/message.constants';

@Component({
  selector: 'app-create',

  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  supervisoryChevron = false;
  supervisoryToggle = false;
  leadershipChevron = false;
  leadershipToggle = false;
  appraisal: any = {};
  departmentList = [];
  currentUser: LoggedInUser;
  status: string;
  loading: Boolean;

  appraisalFrom = {
    jsdate: ''
  };
  appraisalTo = {
    jsdate: ''
  };

  private myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
  };
  private today = new Date();
  // Initialized to specific date (09.10.2018).
  temporarydate = { date: { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() } };



  constructor(private _authenService: AuthenService, private _dataService: DataService, private _notificationService: NotificationService,
    private _utilityService: UtilityService
  ) {

    this.currentUser = _authenService.getLoggedInUser();

    this.departmentList = JSON.parse(this.currentUser.departmentList);

    this.appraisal = {
      associateName: this.currentUser.fullName,
      associateTitle: this.currentUser.userTitle,
      associateId: this.currentUser.userName,
      departmentId: this.currentUser.departmentId
    }
    // alert(JSON.stringify(this.currentUser.depart));
    // debugger 
    if (this.currentUser.userType == 'WK') {
      this.supervisoryToggle = true;
      this.leadershipToggle = true;
    }
    else if (this.currentUser.userType == 'SV') {
      this.leadershipToggle = true;
    }
  }

  ngOnInit() {
  }

  supervisoryClick() {
    this.supervisoryChevron = !this.supervisoryChevron;
  }
  leadershipClick() {
    this.leadershipChevron = !this.leadershipChevron;
  }

  saveAppraisal(valid: Boolean) {
    // Date problem
    let _appraisalMonth = this.temporarydate.date.month.toString().length < 2 ? '0' + this.temporarydate.date.month : this.temporarydate.date.month;
    let _appraisalDay = this.temporarydate.date.day.toString().length < 2 ? '0' + this.temporarydate.date.day : this.temporarydate.date.day;
    let _createDate: string = this.temporarydate.date.year + '-' + _appraisalMonth + '-' + _appraisalDay + 'T12:00:00Z'
    this.appraisal.createDate = new Date(_createDate);

    this.appraisal.from = new Date(this.appraisalFrom.jsdate);
    this.appraisal.to = new Date(this.appraisalTo.jsdate);
    // End date problem

    // alert(JSON.stringify(this.appraisal));
    if (!valid) return;
    this.loading = true;
    this.appraisal.status = this.status;
    this._dataService.post('/api/appraisal/create', JSON.stringify(this.appraisal)).subscribe((response: any) => {
      if (this.status == 'N') this._notificationService.printSuccessMessage(MessageConstants.SAVE_DRAFT_SUCCESS);
      if (this.status == 'S') this._notificationService.printSuccessMessage(MessageConstants.SUBMIT_APPRAISAL_SUCCESS);
      this._utilityService.navigate('/main/appraisal');
    }, error => this._dataService.handleError(error));
  }
}


