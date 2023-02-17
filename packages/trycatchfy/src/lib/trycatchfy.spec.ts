import { trycatchfy } from './trycatchfy';

const INTERNAL_SERVER_ERROR_MOCK = {
  status: 501,
};
const RESPONSE_INTERNAL_ERROR = { response: INTERNAL_SERVER_ERROR_MOCK };
const UNAUTHORIZED_ERROR_MOCK = {
  status: 401,
};
const RESPONSE_UNAUTHORIZED = { response: UNAUTHORIZED_ERROR_MOCK };

const FORBIDDEN_ERROR_MOCK = {
  status: 403,
};
const RESPONSE_FORBIDDEN_ERROR = { response: FORBIDDEN_ERROR_MOCK };

const RESOURCE_ERROR_MOCK = {
  status: 404,
};
const RESPONSE_RESOURCE_ERROR = { response: RESOURCE_ERROR_MOCK };

const fakeHttpRequest = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
};
const errorFactory = (payload: any) => () => {
  throw payload;
};

const expectedBehavior = jest.fn();
const onInternalServerError = jest.fn();
const onUnauthorizedError = jest.fn();
const onForbiddenError = jest.fn();
const onResourceError = jest.fn();
const onEndCycle = jest.fn();
const onScriptError = jest.fn();

describe('trycatchfy', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('Should execute expectedBehavior callback', () => {
    trycatchfy({
      expectedBehavior,
      onUnauthorizedError,
      onEndCycle,
      onInternalServerError,
      onForbiddenError,
      onResourceError,
      onScriptError,
    });
    expect(expectedBehavior).toHaveBeenCalled();
  });

  it('Should throw js error as it is not a http error', async () => {
    const errorMessage = 'js forced error';
    const error = new Error(errorMessage);
    trycatchfy({
      expectedBehavior: errorFactory(error),
      onInternalServerError,
      onUnauthorizedError,
      onEndCycle,
      onForbiddenError,
      onResourceError,
      onScriptError,
    });
    expect(onInternalServerError).not.toHaveBeenCalled();
    expect(onUnauthorizedError).not.toHaveBeenCalled();
    expect(onForbiddenError).not.toHaveBeenCalled();
    expect(onResourceError).not.toHaveBeenCalled();
    expect(onEndCycle).toHaveBeenCalled();
    expect(onScriptError).toHaveBeenCalledWith(error);
  });

  it('Should execute onInternalServerError callback', async () => {
    trycatchfy({
      expectedBehavior: errorFactory(RESPONSE_INTERNAL_ERROR),
      onInternalServerError,
      onUnauthorizedError,
      onEndCycle,
      onForbiddenError,
      onResourceError,
      onScriptError,
    });
    expect(onInternalServerError).toHaveBeenCalledWith(
      INTERNAL_SERVER_ERROR_MOCK
    );
    expect(onUnauthorizedError).not.toHaveBeenCalled();
    expect(onForbiddenError).not.toHaveBeenCalled();
    expect(onResourceError).not.toHaveBeenCalled();
    expect(onEndCycle).toHaveBeenCalled();
  });

  it('Should execute onUnauthorizedError callback', async () => {
    trycatchfy({
      expectedBehavior: errorFactory(RESPONSE_UNAUTHORIZED),
      onUnauthorizedError,
      onEndCycle,
      onInternalServerError,
      onForbiddenError,
      onResourceError,
      onScriptError,
    });
    expect(onInternalServerError).not.toHaveBeenCalled();
    expect(onUnauthorizedError).toHaveBeenCalledWith(UNAUTHORIZED_ERROR_MOCK);
    expect(onForbiddenError).not.toHaveBeenCalled();
    expect(onResourceError).not.toHaveBeenCalled();
    expect(onEndCycle).toHaveBeenCalled();
  });

  it('Should execute onForbiddenError callback', async () => {
    trycatchfy({
      expectedBehavior: errorFactory(RESPONSE_FORBIDDEN_ERROR),
      onForbiddenError,
      onUnauthorizedError,
      onEndCycle,
      onInternalServerError,
      onResourceError,
      onScriptError,
    });

    expect(onInternalServerError).not.toHaveBeenCalled();
    expect(onUnauthorizedError).not.toHaveBeenCalled();
    expect(onForbiddenError).toHaveBeenCalledWith(FORBIDDEN_ERROR_MOCK);
    expect(onResourceError).not.toHaveBeenCalled();
    expect(onEndCycle).toHaveBeenCalled();
  });
  it('Should execute onResourceError callback', async () => {
    trycatchfy({
      expectedBehavior: errorFactory(RESPONSE_RESOURCE_ERROR),
      onResourceError,
      onUnauthorizedError,
      onEndCycle,
      onInternalServerError,
      onForbiddenError,
      onScriptError,
    });

    expect(onInternalServerError).not.toHaveBeenCalled();
    expect(onUnauthorizedError).not.toHaveBeenCalled();
    expect(onForbiddenError).not.toHaveBeenCalled();
    expect(onResourceError).toHaveBeenCalledWith(RESOURCE_ERROR_MOCK);
    expect(onEndCycle).toHaveBeenCalled();
  });

  it('Should execute onEndCycle callback', () => {
    trycatchfy({
      expectedBehavior,
      onEndCycle,
      onUnauthorizedError,
      onInternalServerError,
      onResourceError,
      onForbiddenError,
      onScriptError,
    });

    expect(onInternalServerError).not.toHaveBeenCalled();
    expect(onUnauthorizedError).not.toHaveBeenCalled();
    expect(onForbiddenError).not.toHaveBeenCalled();
    expect(onResourceError).not.toHaveBeenCalled();
    expect(onEndCycle).toHaveBeenCalled();
  });
});
