import { TestBed } from '@angular/core/testing';

import { TicketManagementService } from './ticketManagement.service';

describe('TicketManagementService', () => {
  let service: TicketManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
