import { TestBed } from '@angular/core/testing';

import { TokenmgrTs } from './tokenmgr.ts';

describe('TokenmgrTs', () => {
  let service: TokenmgrTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenmgrTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
