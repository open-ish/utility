import { wrapperTrycatchfy } from './wrapper';

const INTERNAL_SERVER_ERROR_MOCK = {
  status: 501,
};
const RESPONSE_INTERNAL_ERROR = { response: INTERNAL_SERVER_ERROR_MOCK };
const UNAUTHORIZED_ERROR_MOCK = {
  status: 401,
};
const RESPONSE_UNAUTHORIZED = { response: UNAUTHORIZED_ERROR_MOCK };

const errorFactory = (payload: any) => () => {
  throw payload;
};

const onForbiddenError = jest.fn();
const onResourceError = jest.fn();
const onEndCycle = jest.fn();
const onScriptError = jest.fn();
const onHttpExceptionError = jest.fn();

const log = jest.spyOn(console, 'log');
describe('trycatchfy with wrapper', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Should execute onInternalServerError callback', async () => {
    wrapperTrycatchfy({
      expectedBehavior: errorFactory(RESPONSE_INTERNAL_ERROR),
      onForbiddenError,
      onResourceError,
      onScriptError,
      onHttpExceptionError,
      onEndCycle,
    });
    expect(log).toBeCalledWith('server error - reload');
  });

  it('Should execute onUnauthorizedError with a default error', async () => {
    wrapperTrycatchfy({
      expectedBehavior: errorFactory(RESPONSE_UNAUTHORIZED),
      onEndCycle,
      onForbiddenError,
      onResourceError,
      onScriptError,
    });
    expect(log).toBeCalledWith('logout user');
  });
});
