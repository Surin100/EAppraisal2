import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalapprovalComponent } from './goalapproval.component';

describe('GoalapprovalComponent', () => {
  let component: GoalapprovalComponent;
  let fixture: ComponentFixture<GoalapprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoalapprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoalapprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
