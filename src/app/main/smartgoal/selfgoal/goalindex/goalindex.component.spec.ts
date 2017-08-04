import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalindexComponent } from './goalindex.component';

describe('GoalindexComponent', () => {
  let component: GoalindexComponent;
  let fixture: ComponentFixture<GoalindexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoalindexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoalindexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
