import { initTrycatchfy } from '../initTrycatchfy';
import { ITrycatchfyParams } from '../models';

interface IFakeAxios {
  response: any;
  status: number;
}
export const customHttpErrors = [
  { statusCode: 900, handleName: 'myCustomStatusCode' },
  { statusCode: 901, handleName: 'myOtherCustomStatusCode' },
  {
    statusHandle: (status: number) => status.toString().startsWith('1'),
    handleName: 'myCustomStatusHandle',
  },
];

const trycatchfy = initTrycatchfy({
  customHttpErrors,
});

export const wrapperTrycatchfy = ({
  expectedBehavior,
  onForbiddenError,
  onResourceError,
  onScriptError,
  myCustomStatusCode,
  onEndCycle,
  onHttpExceptionError,
}: Omit<
  ITrycatchfyParams<IFakeAxios>,
  'onUnauthorizedError' | 'onInternalServerError'
> & {
  myCustomStatusCode: ITrycatchfyParams<IFakeAxios>['onResourceError'];
}) => {
  const onUnauthorizedErrorDefault = () => {
    console.log('logout user');
  };
  const onInternalServerErrorDefault = () => {
    console.log('server error - reload');
  };
  return trycatchfy<IFakeAxios>({
    expectedBehavior,
    onForbiddenError,
    onResourceError,
    customHttpErrorsHandle: { myCustomStatusCode },
    onScriptError,
    onHttpExceptionError,
    onUnauthorizedError: onUnauthorizedErrorDefault,
    onInternalServerError: onInternalServerErrorDefault,
    onEndCycle,
  });
};
