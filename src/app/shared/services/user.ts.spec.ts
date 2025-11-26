import { TestBed } from '@angular/core/testing';

import { UserTs } from './user.ts';

describe('UserTs', () => {
  let service: UserTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
