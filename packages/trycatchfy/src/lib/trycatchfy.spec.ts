import { trycatchfy } from './trycatchfy';

describe('trycatchfy', () => {
  it('should work', () => {
    expect(trycatchfy()).toEqual('trycatchfy');
  });
  it.todo('Should execute onsuccess callback');
  it.todo('Should execute onServerError callback');
  it.todo('Should execute onEndCycle callback');
});
