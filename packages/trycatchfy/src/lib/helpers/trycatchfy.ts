import { ITrycatchfyParams, ITrycatchfyError } from '../models';

import { httpMappedErrorsHelper } from './mappedErrors';

const unExecutableFunction = () => null;

/**
 *
  @param expectedBehavior is the expected behavior of the http request. Usually what we put on the try block of the trycatch.
  @param onUnauthorizedError is the callback function called on 401 http request errors request.
  @param onForbiddenError is the callback function called on 403 http request errors request.
  @param onResourceError is the callback function called on 404 http request errors request.
  @param onInternalServerError is the callback function called on any 5** http request errors request.
  @param onHttpExceptionError is the callback function called on not mapped http errors.
  @param onScriptError is the callback function called when there are javascript errors. It might happen when it gets a 200 status code, but the contract has been changed.
  @param onEndCycle is the callback function called in the finally block of trycatch.
onScriptError
*/
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
