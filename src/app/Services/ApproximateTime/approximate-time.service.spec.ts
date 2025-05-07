import { TestBed } from '@angular/core/testing';

import { ApproximateTimeService } from './approximate-time.service';

describe('ApproximateTimeService', () => {
  let service: ApproximateTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApproximateTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
