import { TestBed } from '@angular/core/testing';

import { CalcForceService } from './calc-force.service';

describe('CalcForceService', () => {
  let service: CalcForceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalcForceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
