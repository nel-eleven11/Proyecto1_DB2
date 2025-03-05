import { TestBed } from '@angular/core/testing';

import { PaymentsCrudService } from './payments-crud.service';

describe('PaymentsCrudService', () => {
  let service: PaymentsCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentsCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
