import { TestBed } from '@angular/core/testing';

import { ShoppingGuardService } from './shopping-guard.service';

describe('ShoppingGuardService', () => {
  let service: ShoppingGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShoppingGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
