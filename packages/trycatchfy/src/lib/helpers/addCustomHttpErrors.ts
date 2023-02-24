import { IHttpErrorHelper } from '../../index.d';
import { httpErrorsHelper } from './mappedErrors';

export const addCustomHttpErrors = (customHttpErrors: IHttpErrorHelper[]) => {
  customHttpErrors.forEach((error) => {
    httpErrorsHelper.push(error);
  });
};
