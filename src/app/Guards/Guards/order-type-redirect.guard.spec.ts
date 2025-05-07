import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { orderTypeRedirectGuard } from './order-type-redirect.guard';

describe('orderTypeRedirectGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => orderTypeRedirectGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
