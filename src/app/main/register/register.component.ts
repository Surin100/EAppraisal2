import { Component, OnInit, ViewChild } from '@angular/core';

import * as XLSX from 'xlsx';

import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { HandleErrorService } from '../../core/services/handle-error.service';
import { MessageConstants } from '../../core/common/message.constants';
import { EmployeeRegister } from '../../core/domain/employee.register';
import { ChangeLineManager } from '../../core/domain/linemanager.change';
import { SystemConstants } from '../../core/common/system.constants';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @ViewChild('excelFile') excelFile;
  @ViewChild('changeLMFile') changeLMFile;
  user: any = {};
  assignLM: any = {};
  resetPasswordLoading: Boolean = false;
  registerEmployeesLoading: Boolean = false;
  changeLineManagerLoading: Boolean = false;
  assignLM1Loading: Boolean = false;
  assignLM2Loading: Boolean = false;

  registerArray: any = [];
  registerErrors: any = [];

  changeLMArray: any = [];
  changeLMErrors: any = [];

  registerEmployeeTemplatePath: string = '/Templates/RegisterEmployeesTemplate.xlsx';
  changeLineManagerTemplatePath: string ='/Templates/ChangeLineManagerTemplate.xlsx'

  constructor(private _dataService: DataService, private _notificationService: NotificationService,
    private _handleErrorService: HandleErrorService
  ) {
  }

  ngOnInit() {
  }

  resetPassword() {
    if (!this.user.userName) return;
    this.resetPasswordLoading = true;
    // debugger
    this._dataService.post('/api/Account/ResetPassword', this.user).subscribe((response: any) => {
      this._notificationService.printSuccessMessage('The password has been reset.');
      this.resetPasswordLoading = false;
    }, error => {
      this._handleErrorService.handleError(error);
      this.resetPasswordLoading = false;
    });
  }

  assignLineManager(assignType: string) {
    this.assignLM.AssignType = assignType;
    this.assignLM1Loading = assignType == 'LM1' ? true : false;
    this.assignLM2Loading = assignType == 'LM2' ? true : false;
    this._dataService.post('/api/Account/AssignLineManager', this.assignLM).subscribe((response) => {
      this._notificationService.printSuccessMessage(MessageConstants.ASSIGN_LINEMANAGER_OK_MSG);
      this.assignLM1Loading = false;
      this.assignLM2Loading = false;
    }, error => {
      // alert(JSON.stringify(error));
      this._handleErrorService.handleError(error);
      this.assignLM1Loading = false;
      this.assignLM2Loading = false;
    })
  }

  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'binary' };

  registerEmployees() {
    this.registerEmployeesLoading = true;
    this.registerArray = [];
    var files: any[] = this.excelFile.nativeElement.files;
    if (files.length == 0) { this.registerEmployeesLoading = false; return; }
    if (files.length > 1) { throw new Error("Cannot upload multiple files on the entry") };
    const reader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      /* grab first sheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* save data */
      let data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      data.forEach(element => {
        let register = new EmployeeRegister(element[0], element[1], element[2], element[4]
          , element[6], element[7], element[8], element[9], element[10]);
        this.registerArray.push(register);
      });
      this.registerArray.splice(0, 1);
      // console.log(this.registerArray);
      var registerPromise = new Promise((resolve, reject) => {
        this._dataService.post('/api/Account/RegisterEmployees', this.registerArray).subscribe((response: any) => {
          this.registerErrors = response;
          resolve(this.registerErrors);
          this._notificationService.printSuccessMessage(MessageConstants.REGISTER_EMPLOYEES_OK_MSG);
        }, error => {
          this._handleErrorService.handleError(error);
          resolve(error);
        });
      });

      registerPromise.then(() => {
        this.registerEmployeesLoading = false;
      });

      // console.log(this.registerArray);
    };
    reader.readAsBinaryString(files[0]);
  }

  changeLineManager(){
    this.changeLineManagerLoading = true;
    this.changeLMArray = [];
    var files: any[] = this.changeLMFile.nativeElement.files;
    if (files.length == 0) { this.changeLineManagerLoading = false; return; }
    if (files.length > 1) { throw new Error("Cannot upload multiple files on the entry") };
    const reader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      /* grab first sheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* save data */
      let data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      data.forEach(element => {
        let changeLM = new ChangeLineManager(element[0], element[2], element[4]);
        console.log(changeLM);
        this.changeLMArray.push(changeLM);
      });
      this.changeLMArray.splice(0, 1);
      // console.log(this.changeLMArray);
      var changeLMPromise = new Promise((resolve, reject) => {
        this._dataService.post('/api/Account/ChangeLineManager', this.changeLMArray).subscribe((response: any) => {
          this.changeLMErrors = response;
          resolve(this.changeLMErrors);
          this._notificationService.printSuccessMessage(MessageConstants.CHANGE_LINEMANAGER_OK_MSG);
        }, error => {
          this._handleErrorService.handleError(error);
          resolve(error);
        });
      });

      changeLMPromise.then(() => {
        this.changeLineManagerLoading = false;
      });

      // console.log(this.registerArray);
    };
    reader.readAsBinaryString(files[0]);
  }

  getRegisterEmployeesTemplate(){
    window.open(SystemConstants.BASE_API + this.registerEmployeeTemplatePath);
  }
  getChangeLineManagerTemplate(){
    window.open(SystemConstants.BASE_API + this.changeLineManagerTemplatePath);
  }
}
