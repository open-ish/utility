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

export const trycatchfy = async (
  params: ITrycatchfyParams
): Promise<void | Error> => {
  const {
    expectedBehavior,
    onEndCycle = unExecutableFunction,
    onScriptError = unExecutableFunction,
  } = params;
  try {
    expectedBehavior();
  } catch (error: ITrycatchfyError | any) {
    const httpAxiosStatus = error.response?.status;
    !httpAxiosStatus && onScriptError(error);

    const errorResponse = error.response;

    httpErrorsHelper.forEach(({ statusCode, handleName, statusHandle }) => {
      const isError =
        statusHandle?.(httpAxiosStatus) ?? httpAxiosStatus === statusCode;
      isError && params[handleName as keyof typeof params](errorResponse);
    });
  } finally {
    onEndCycle();
  }
};
