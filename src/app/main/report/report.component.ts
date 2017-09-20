import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
SummaryPerformanceAppraisalActive:Boolean = true;
  constructor() { }

  ngOnInit() {
  }

  viewReportForm(reportName: String){
    this.SummaryPerformanceAppraisalActive = false;

    switch(reportName){
      case 'SummaryPerformanceAppraisal': this.SummaryPerformanceAppraisalActive = true; break;
    }
  }
}
