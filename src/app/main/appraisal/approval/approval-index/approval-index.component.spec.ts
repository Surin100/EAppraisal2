import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalIndexComponent } from './approval-index.component';

describe('ApprovalIndexComponent', () => {
  let component: ApprovalIndexComponent;
  let fixture: ComponentFixture<ApprovalIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
