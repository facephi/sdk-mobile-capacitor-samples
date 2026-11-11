import { TestBed } from '@angular/core/testing';
import { FacephiService } from './facephi.service';

describe('FacephiService', () => {
  let service: FacephiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacephiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
