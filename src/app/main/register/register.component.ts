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
  assignLM1Loading: Boolean = false;
  assignLM2Loading: Boolean = false;

  registerArray: any = [];
  registerErrors: any = [];
  registerSheetName: string;
  registerEmployeesLoading: Boolean = false;
  registerFromRow: number;
  registerToRow: number;

  changeLMArray: any = [];
  changeLMErrors: any = [];
  changeLMSheetName: string;
  changeLineManagerLoading: Boolean = false;
  changeLMFromRow: number;
  changeLMToRow: number;

  changeEmployeeLv: any = {};
  changeEmployeeLvLoading: Boolean = false;

  registerEmployeeTemplatePath: string = '/Templates/ImportUserTemplate.xlsx';
  changeLineManagerTemplatePath: string = '/Templates/ImportLineManagerTemplate.xlsx'

  constructor(private _dataService: DataService, private _notificationService: NotificationService,
    private _handleErrorService: HandleErrorService
  ) {
  }

  ngOnInit() {
    this.registerSheetName = "Import User";
    this.changeLMSheetName = "Import Line Manager"
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
    // console.log(this.excelFile.nativeElement.value);
    var files: any[] = this.excelFile.nativeElement.files;

    // validate

    if (files.length === 0 || this.validateFromToRow(this.registerFromRow, this.registerToRow) === false) {
      this.registerEmployeesLoading = false; return;
    }
    if (files.length > 1) { throw new Error("Cannot upload multiple files on the entry") };

    // End of Validate

    const reader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      /* grab first sheet */
      // const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[this.registerSheetName];
      /* save data */
      let data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      // console.log(data);
      if (data.length < 2 || data.length < this.registerFromRow) {
        this._notificationService.printErrorMessage("Sheet name does not exist or there is not data.");
        this.registerEmployeesLoading = false;
        return;
      }
      // console.log(data);
      let row: number = 1;
      data.forEach(element => {
        if (row >= this.registerFromRow && row <= this.registerToRow) {
          let register = new EmployeeRegister(row, element[0], element[1], element[2], element[4]
            , element[6], element[7], element[8], element[9], element[10]);
          this.registerArray.push(register);
        }
        row++;
      });
      // this.registerArray.splice(0, 1);
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

  changeLineManager() {
    this.changeLineManagerLoading = true;
    this.changeLMArray = [];
    var files: any[] = this.changeLMFile.nativeElement.files;
    if (files.length == 0 || this.validateFromToRow(this.changeLMFromRow, this.changeLMToRow) === false) {
      this.changeLineManagerLoading = false; return;
    }
    if (files.length > 1) { throw new Error("Cannot upload multiple files on the entry") };
    const reader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      /* grab first sheet */
      // const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[this.changeLMSheetName];
      /* save data */
      let data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      if (data.length < 2 || data.length < this.changeLMFromRow) {
        this._notificationService.printErrorMessage("Sheet name does not exist or there is not data.");
        this.changeLineManagerLoading = false;
        return;
      }
      let row: number = 1;
      data.forEach(element => {
        if (row >= this.changeLMFromRow && row <= this.changeLMToRow) {
          let changeLM = new ChangeLineManager(row, element[0], element[2], element[4]);
          // console.log(changeLM);
          this.changeLMArray.push(changeLM);
        }
        row++;
      });
      
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

  changeEmployeeLevel(){
    this.changeEmployeeLvLoading = true;
    var changeELPromise = new Promise((Resolve, Reject) => {
      this._dataService.post('/api/Account/ChangeEmployeeLevel', this.changeEmployeeLv).subscribe((response: any) => {
        Resolve(response);
        this._notificationService.printSuccessMessage(MessageConstants.CHANGE_EMPLOYEELEVEL_OK_MSG);
      }, error => {
        this._handleErrorService.handleError(error);
        Resolve(error);
      });
    });
    changeELPromise.then(() => {
      this.changeEmployeeLvLoading = false;
    });
  }

  getRegisterEmployeesTemplate() {
    window.open(SystemConstants.BASE_API + this.registerEmployeeTemplatePath);
  }
  getChangeLineManagerTemplate() {
    window.open(SystemConstants.BASE_API + this.changeLineManagerTemplatePath);
  }

  validateFromToRow(FromRow: number, ToRow: number): Boolean {
    if (!FromRow) {
      this._notificationService.printErrorMessage("From Row is required.");
      this.registerEmployeesLoading = false;
      return false;
    }
    if (isNaN(FromRow)) {
      this._notificationService.printErrorMessage("From Row should be a number.");
      this.registerEmployeesLoading = false;
      return false;
    }
    if (FromRow < 2) {
      this._notificationService.printErrorMessage("From Row should be larger than 1.");
      this.registerEmployeesLoading = false;
      return false;
    }

    if (!ToRow) {
      this._notificationService.printErrorMessage("To Row is required.");
      this.registerEmployeesLoading = false;
      return false;
    }
    if (isNaN(ToRow)) {
      this._notificationService.printErrorMessage("To Row should be a number.");
      this.registerEmployeesLoading = false;
      return false;
    }
    if (ToRow < 2) {
      this._notificationService.printErrorMessage("To Row should be larger than 1.");
      this.registerEmployeesLoading = false;
      return false;
    }
// console.log(FromRow + ' ' + ToRow);
    if (FromRow - ToRow > 0 ) {
      this._notificationService.printErrorMessage("To Row should be larger than From Row.");
      this.registerEmployeesLoading = false;
      return false;
    }
    return true;
  }
}
