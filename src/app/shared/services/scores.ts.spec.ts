import { TestBed } from '@angular/core/testing';

import { ScoresTs } from './scores.ts';

describe('ScoresTs', () => {
  let service: ScoresTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScoresTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
