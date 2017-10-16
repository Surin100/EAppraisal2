import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartGoalGuidelineComponent } from './smart-goal-guideline.component';

describe('SmartGoalGuidelineComponent', () => {
  let component: SmartGoalGuidelineComponent;
  let fixture: ComponentFixture<SmartGoalGuidelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartGoalGuidelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartGoalGuidelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
