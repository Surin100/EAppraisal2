import { TestBed, async, inject } from '@angular/core/testing';

import { NewUserGuard } from './new-user.guard';

describe('NewUserGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewUserGuard]
    });
  });

  it('should ...', inject([NewUserGuard], (guard: NewUserGuard) => {
    expect(guard).toBeTruthy();
  }));
});
