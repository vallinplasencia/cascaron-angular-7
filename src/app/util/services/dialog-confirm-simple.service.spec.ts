import { TestBed } from '@angular/core/testing';

import { DialogConfirmSimpleService } from './dialog-confirm-simple.service';

describe('DialogConfirmSimpleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DialogConfirmSimpleService = TestBed.get(DialogConfirmSimpleService);
    expect(service).toBeTruthy();
  });
});
