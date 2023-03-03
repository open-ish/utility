import { IHttpMappedErrorsHelper } from '../models';
import { httpMappedErrorsHelper } from './mappedErrors';

export const addCustomHttpErrors = (
  customHttpErrors: IHttpMappedErrorsHelper[]
) => {
  customHttpErrors.forEach((error) => {
    httpMappedErrorsHelper.push(error);
  });
};
