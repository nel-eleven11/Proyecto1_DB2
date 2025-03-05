import { TestBed } from '@angular/core/testing';

import { TransactionsCrudService } from './transactions-crud.service';

describe('TransactionsCrudService', () => {
  let service: TransactionsCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionsCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
