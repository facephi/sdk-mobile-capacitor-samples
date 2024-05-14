import { TestBed } from '@angular/core/testing';

import { SelphidService } from './selphid.service';

describe('SelphidService', () => {
  let service: SelphidService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelphidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
