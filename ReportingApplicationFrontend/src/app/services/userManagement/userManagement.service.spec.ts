import { TestBed } from '@angular/core/testing';

import { UserManagementService } from './userManagement.service';

describe('UserManagementService', () => {
  let service: UserManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
