import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LMManagementComponent } from './lmmanagement.component';

describe('LMManagementComponent', () => {
  let component: LMManagementComponent;
  let fixture: ComponentFixture<LMManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LMManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LMManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
