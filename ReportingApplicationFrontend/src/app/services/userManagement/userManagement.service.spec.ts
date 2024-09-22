import { TestBed } from '@angular/core/testing';

import { AdministratorService } from './userManagement.service';

describe('AdministratorService', () => {
  let service: AdministratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdministratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
