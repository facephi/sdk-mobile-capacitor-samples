import { TestBed } from '@angular/core/testing';

import { SelphiService } from './selphi.service';

describe('SelphiService', () => {
  let service: SelphiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelphiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
