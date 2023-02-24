import { IHttpErrorHelper } from '../../index.d';

export const httpErrorsHelper: IHttpErrorHelper[] = [
  {
    handleName: 'onInternalServerError',
    statusHandle: (status: number) => String(status).startsWith('5'),
  },
  { handleName: 'onUnauthorizedError', statusCode: 401 },
  { handleName: 'onForbiddenError', statusCode: 403 },
  { handleName: 'onResourceError', statusCode: 404 },
];
