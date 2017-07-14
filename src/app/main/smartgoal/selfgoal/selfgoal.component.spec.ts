import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfgoalComponent } from './selfgoal.component';

describe('SelfgoalComponent', () => {
  let component: SelfgoalComponent;
  let fixture: ComponentFixture<SelfgoalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfgoalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfgoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
