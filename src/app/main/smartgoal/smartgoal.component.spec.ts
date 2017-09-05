import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartGoalComponent } from './smartgoal.component';

describe('SmartgoalComponent', () => {
  let component: SmartGoalComponent;
  let fixture: ComponentFixture<SmartGoalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartGoalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
