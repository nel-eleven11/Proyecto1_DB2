import { TestBed } from '@angular/core/testing';

import { AccountsCrudService } from './accounts-crud.service';

describe('AccountsCrudService', () => {
  let service: AccountsCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountsCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
