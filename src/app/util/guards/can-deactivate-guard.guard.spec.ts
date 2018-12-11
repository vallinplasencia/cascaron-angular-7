import { TestBed, async, inject } from '@angular/core/testing';

import { CanDeactivateGuardGuard } from './can-deactivate-guard.guard';

describe('CanDeactivateGuardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanDeactivateGuardGuard]
    });
  });

  it('should ...', inject([CanDeactivateGuardGuard], (guard: CanDeactivateGuardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
