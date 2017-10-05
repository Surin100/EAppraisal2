import { Component, OnInit, HostListener } from '@angular/core';

import * as $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
top: number = 0;
height: number = 0;

  constructor() { }

  ngOnInit() {
    // var s = document.getElementById('homeMenu');
    // s.setAttribute('class', 'active');
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    this.height = window.innerHeight;
    this.top = $(window).scrollTop();
  }

  bttClick(e){
    // alert('a');
    $('body,html').animate({scrollTop:0},500);
    e.preventDefault();
  }
}
