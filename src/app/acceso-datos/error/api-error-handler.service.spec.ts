import { TestBed } from '@angular/core/testing';

import { ApiErrorHandlerService } from './api-error-handler.service';

describe('ApiErrorHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiErrorHandlerService = TestBed.get(ApiErrorHandlerService);
    expect(service).toBeTruthy();
  });
});
