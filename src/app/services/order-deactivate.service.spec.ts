import { TestBed } from '@angular/core/testing';

import { OrderDeactivateService } from './order-deactivate.service';

describe('OrderDeactivateService', () => {
  let service: OrderDeactivateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderDeactivateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
