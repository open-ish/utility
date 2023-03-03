import { ITrycatchfyParams, ITrycatchfyError } from '../models';

import { httpMappedErrorsHelper } from './mappedErrors';

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
    const isMappedError = httpMappedErrorsHelper.find(
      ({ statusCode, statusHandle }) =>
        statusHandle?.(httpAxiosStatus) ?? httpAxiosStatus === statusCode
    );

    isMappedError
      ? params[isMappedError.handleName]?.(errorResponse)
      : onHttpExceptionError(error);
  } finally {
    onEndCycle();
  }
};
