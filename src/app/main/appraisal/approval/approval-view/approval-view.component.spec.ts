import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalViewComponent } from './approval-view.component';

describe('ApprovalViewComponent', () => {
  let component: ApprovalViewComponent;
  let fixture: ComponentFixture<ApprovalViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
