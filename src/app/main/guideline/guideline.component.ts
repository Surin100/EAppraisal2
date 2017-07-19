import { Component, OnInit } from '@angular/core';
// import { Html} from '@angular/html'

import { DataService } from '../../core/services/data.service';
import { HandleErrorService } from '../../core/services/handle-error.service';

@Component({
  selector: 'app-guideline',
  templateUrl: './guideline.component.html',
  styleUrls: ['./guideline.component.css']
})
export class GuidelineComponent implements OnInit {
  guidelineContent: string;
  constructor(private _handleErrorService: HandleErrorService, private _dataService:DataService) {
    _dataService.get('/api/main/guideline').subscribe((respone: string) => {
      this.guidelineContent = respone;
    }, error => this._handleErrorService.handleError(error));
  }

  ngOnInit() {
  }

}
