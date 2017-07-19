import { TestBed, async, inject } from '@angular/core/testing';

import { NonAuthenGuard } from './non-authen.guard';

describe('NonAuthenGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NonAuthenGuard]
    });
  });

  it('should ...', inject([NonAuthenGuard], (guard: NonAuthenGuard) => {
    expect(guard).toBeTruthy();
  }));
});
