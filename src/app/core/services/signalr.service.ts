import { Injectable, EventEmitter } from '@angular/core';
import { SystemConstants } from './../common/system.constants';
import { AuthenService } from './authen.service';
@Injectable()
export class SignalrService {

  // Declare the variables  
  private proxy: any;
  private proxyName: string = 'eappraisalHub';
  public connection: any;
  // create the Event Emitter  
  public updateApprovalList: EventEmitter<any>;

  public connectionEstablished: EventEmitter<Boolean>;
  public connectionExists: Boolean;

  constructor(private _authenService: AuthenService) {
    // Constructor initialization  
    this.connectionEstablished = new EventEmitter<Boolean>();
    this.updateApprovalList = new EventEmitter<any>();
    this.connectionExists = false;
    // create hub connection  
    this.connection = $.hubConnection(SystemConstants.BASE_API);
    this.connection.qs = { "access_token": this._authenService.getLoggedInUser().access_token };
    // create new proxy as name already given in top  
    this.proxy = this.connection.createHubProxy(this.proxyName);
    // register on server events  
    // this.registerOnServerEvents();
    // call the connecion start method to start the connection to send and receive events.  
    // this.startConnection();
  }
  // check in the browser console for either signalr connected or not  
  startConnection(): void {
    // debugger;
    
    this.connection.start().done((data: any) => {
      console.log('Now connected ' + data.transport.name + ', connection ID= ' + data.id);
      this.connectionEstablished.emit(true);
      this.connectionExists = true;
    }).fail((error: any) => {
      console.log('Could not connect ' + error);
      this.connectionEstablished.emit(false);
    });
  }

  registerOnServerEvents(): void {
    this.proxy.on('addNeedYourApprovalMessage', (announcement: any) => {
      this.updateApprovalList.emit(announcement);
    });
  }

  stopConnection(): void{
    // this.connection.stop().done();
    this.connection.stop();
    this.connection = undefined;
    this.proxy = undefined;
  }
}

