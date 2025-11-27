import { TestBed } from '@angular/core/testing';

import { Tokenmgr } from './tokenmgr';

describe('Tokenmgr', () => {
  let service: Tokenmgr;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tokenmgr);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
