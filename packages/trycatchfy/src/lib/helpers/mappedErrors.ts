import { IHttpMappedErrorsHelper } from '../models';

export const httpMappedErrorsHelper: IHttpMappedErrorsHelper[] = [
  {
    handleName: 'onInternalServerError',
    statusHandle: (status: number) => String(status).startsWith('5'),
  },
  { handleName: 'onUnauthorizedError', statusCode: 401 },
  { handleName: 'onForbiddenError', statusCode: 403 },
  { handleName: 'onResourceError', statusCode: 404 },
];
