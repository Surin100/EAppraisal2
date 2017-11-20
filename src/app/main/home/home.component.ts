import { Component, OnInit, HostListener, NgZone } from '@angular/core';

import { SignalrService } from '../../core/services/signalr.service';
import { AuthenService } from '../../core/services/authen.service';
import { LoggedInUser } from '../../core/domain/loggedin.user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  top: number = 0;
  height: number = 0;
  currentUser: LoggedInUser;

  constructor(private _ngZone: NgZone, private _signalrService:SignalrService, private _authenService: AuthenService) {
    this.currentUser = _authenService.getLoggedInUser();
  }

  ngOnInit() {

    // if(this.currentUser.roles.includes('HRExecutive') || this.currentUser.roles.includes('LineManager')){
    //   this.subscribeToEvents();
    // }

    // var s = document.getElementById('homeMenu');
    // s.setAttribute('class', 'active');
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    this.height = window.innerHeight;
    this.top = $(window).scrollTop();
  }

  bttClick(e) {
    // alert('a');
    $('body,html').animate({ scrollTop: 0 }, 500);
    e.preventDefault();
  }

  subscribeToEvents(): void{
    this._signalrService.startConnection();
    
    this._signalrService.registerOnServerEvents();
    //if connection exists it can call of method
    this._signalrService.connectionEstablished.subscribe((data:boolean)=>{
      // console.log(this.canSendMessage);
    }); 

    this._signalrService.updateApprovalList.subscribe((message:any)=>{
      // console.log(message);
      this._ngZone.run(() => {

      });
    });
  }
}
