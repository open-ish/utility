import { trycatchfy } from './trycatchfy';
import { ITrycatchfyParams } from '../index.d';

interface IFakeAxios {
  response: any;
  status: number;
}

export const wrapperTrycatchfy = async ({
  expectedBehavior,
  onForbiddenError,
  onResourceError,
  onScriptError,
  onEndCycle,
  onHttpExceptionError,
}: Omit<
  ITrycatchfyParams<IFakeAxios>,
  'onUnauthorizedError' | 'onInternalServerError'
>) => {
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
    onScriptError,
    onHttpExceptionError,
    onUnauthorizedError: onUnauthorizedErrorDefault,
    onInternalServerError: onInternalServerErrorDefault,
    onEndCycle,
  });
};
