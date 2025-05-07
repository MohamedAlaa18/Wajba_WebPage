import { TestBed } from '@angular/core/testing';
import { AfterActionService } from './after-action.service';



describe('AfterActionService', () => {
  let service: AfterActionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AfterActionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
