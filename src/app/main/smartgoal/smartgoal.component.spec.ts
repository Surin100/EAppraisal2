import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartgoalComponent } from './smartgoal.component';

describe('SmartgoalComponent', () => {
  let component: SmartgoalComponent;
  let fixture: ComponentFixture<SmartgoalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartgoalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartgoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
