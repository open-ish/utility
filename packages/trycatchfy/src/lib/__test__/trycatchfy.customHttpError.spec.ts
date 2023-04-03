import { wrapperTrycatchfy } from './wrapper';

const CUSTOM_STATUS_CODE_ERROR_MOCK = {
  status: 900,
};
const RESPONSE_CUSTOM_STATUS_CODE = { response: CUSTOM_STATUS_CODE_ERROR_MOCK };

const errorFactory = (payload: any) => () => {
  throw payload;
};

const onForbiddenError = jest.fn();
const onResourceError = jest.fn();
const onEndCycle = jest.fn();
const onScriptError = jest.fn();
const onHttpExceptionError = jest.fn();
const myCustomStatusCode = jest.fn();

const log = jest.spyOn(console, 'log');
describe('customHttpError - custom http error handle', () => {
  it('Should call custom http error handle', () => {
    wrapperTrycatchfy({
      expectedBehavior: errorFactory(RESPONSE_CUSTOM_STATUS_CODE),
      onForbiddenError,
      onResourceError,
      onScriptError,
      onHttpExceptionError,
      onEndCycle,
      myCustomStatusCode,
    });
    expect(myCustomStatusCode).toBeCalledWith(CUSTOM_STATUS_CODE_ERROR_MOCK);
  });
});
