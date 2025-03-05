import { TestBed } from '@angular/core/testing';

import { CardsCrudService } from './cards-crud.service';

describe('CardsCrudService', () => {
  let service: CardsCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardsCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
