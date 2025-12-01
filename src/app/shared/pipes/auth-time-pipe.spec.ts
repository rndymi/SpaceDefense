import { AuthTimePipe } from './auth-time-pipe';

describe('AuthTimePipe', () => {
  it('create an instance', () => {
    const pipe = new AuthTimePipe();
    expect(pipe).toBeTruthy();
  });
});
