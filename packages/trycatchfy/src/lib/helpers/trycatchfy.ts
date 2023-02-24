import { ITrycatchfyParams, ITrycatchfyError } from '../../index.d';

import { httpErrorsHelper } from './mappedErrors';

const unExecutableFunction = () => null;

export const trycatchfy = async <IAxiosErrorResponse>(
  params: ITrycatchfyParams<IAxiosErrorResponse>
): Promise<void | Error> => {
  params = {
    ...params,
    ...params.customHttpErrorsHandle,
  };
  const {
    expectedBehavior,
    onEndCycle = unExecutableFunction,
    onScriptError = unExecutableFunction,
    onHttpExceptionError = unExecutableFunction,
  } = params;
  try {
    await expectedBehavior();
  } catch (error: ITrycatchfyError | any) {
    const httpAxiosStatus = error.response?.status;
    if (!httpAxiosStatus) return onScriptError(error);

    const errorResponse = error.response;
    const isMappedError = httpErrorsHelper.find(
      ({ statusCode, statusHandle }) =>
        statusHandle?.(httpAxiosStatus) ?? httpAxiosStatus === statusCode
    );

    isMappedError
      ? params[isMappedError.handleName as keyof typeof params]?.(errorResponse)
      : onHttpExceptionError(error);
  } finally {
    onEndCycle();
  }
};
