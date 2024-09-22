import { TestBed } from '@angular/core/testing';
import { CanActivateChildFn } from '@angular/router';

import { authenticationChildrenGuard } from './authentication-children.guard';

describe('authenticationGuard', () => {
  const executeGuard: CanActivateChildFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authenticationChildrenGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
