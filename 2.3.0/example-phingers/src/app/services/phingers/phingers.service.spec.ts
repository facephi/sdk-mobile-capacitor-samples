import { TestBed } from '@angular/core/testing';

import { PhingersService } from './phingers.service';

describe('PhingersService', () => {
  let service: PhingersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhingersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
