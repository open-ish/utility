import { featflagByEnv } from './featflag-by-env';

describe('featflagByEnv', () => {
  it('should work', () => {
    expect(featflagByEnv()).toEqual('featflag-by-env');
  });
});
