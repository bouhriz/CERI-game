import { TestBed } from '@angular/core/testing';

import { BandeauServiceService } from './bandeau-service.service';

describe('BandeauServiceService', () => {
  let service: BandeauServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BandeauServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
