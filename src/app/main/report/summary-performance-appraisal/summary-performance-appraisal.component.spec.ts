import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryPerformanceAppraisalComponent } from './summary-performance-appraisal.component';

describe('SummaryPerformanceAppraisalComponent', () => {
  let component: SummaryPerformanceAppraisalComponent;
  let fixture: ComponentFixture<SummaryPerformanceAppraisalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryPerformanceAppraisalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryPerformanceAppraisalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
