import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreategoalComponent } from './creategoal.component';

describe('CreategoalComponent', () => {
  let component: CreategoalComponent;
  let fixture: ComponentFixture<CreategoalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreategoalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreategoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
