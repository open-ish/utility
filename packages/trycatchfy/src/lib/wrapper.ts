import { trycatchfy } from './trycatchfy';
import { ITrycatchfyParams } from '../index.d';

interface IWrapperTrycatchfy {
  expectedBehavior: ITrycatchfyParams['expectedBehavior'];
  onForbiddenError: ITrycatchfyParams['onForbiddenError'];
  onResourceError: ITrycatchfyParams['onResourceError'];
  onScriptError: ITrycatchfyParams['onScriptError'];
  onEndCycle: () => void;
}

export const wrapperTrycatchfy = async ({
  expectedBehavior,
  onForbiddenError,
  onResourceError,
  onScriptError,
  onEndCycle,
}: IWrapperTrycatchfy) => {
  const onUnauthorizedErrorDefault = () => {
    console.log('logout user');
  };
  const onInternalServerErrorDefault = () => {
    console.log('server error - reload');
  };
  await trycatchfy({
    expectedBehavior,
    onForbiddenError,
    onResourceError,
    onScriptError,
    onUnauthorizedError: onUnauthorizedErrorDefault,
    onInternalServerError: onInternalServerErrorDefault,
    onEndCycle,
  });
};
