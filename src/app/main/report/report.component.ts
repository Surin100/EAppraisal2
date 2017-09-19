import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
SummaryPerformanceAppraisal:Boolean = false;
  constructor() { }

  ngOnInit() {
  }

  viewReportForm(reportName: String){
    this.SummaryPerformanceAppraisal = false;

    switch(reportName){
      case 'SummaryPerformanceAppraisal': this.SummaryPerformanceAppraisal = true; break;
    }
  }
}
