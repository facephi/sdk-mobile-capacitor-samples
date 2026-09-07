import { TestBed } from '@angular/core/testing';

import { VideoidService } from './videoid.service';

describe('VideoidService', () => {
  let service: VideoidService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
