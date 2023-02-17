import { ITrycatchfyParams, ITrycatchfyError } from '../index.d';

const unExecutableFunction = () => null;
const httpErrorsHelper = [
  {
    handleName: 'onInternalServerError',
    statusHandle: (status: number) => String(status).startsWith('5'),
  },
  { handleName: 'onUnauthorizedError', statusCode: 401 },
  { handleName: 'onForbiddenError', statusCode: 403 },
  { handleName: 'onResourceError', statusCode: 404 },
];
export const trycatchfy = async <IAxiosErrorReponse>(
  params: ITrycatchfyParams<IAxiosErrorReponse>
): Promise<void | Error> => {
  const {
    expectedBehavior,
    onEndCycle = unExecutableFunction,
    onScriptError = unExecutableFunction,
    onHttpExceptionError = unExecutableFunction,
  } = params;
  try {
    expectedBehavior();
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
