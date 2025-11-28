import { TestBed } from '@angular/core/testing';

import { PlayState } from './play-state';

describe('PlayState', () => {
  let service: PlayState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
