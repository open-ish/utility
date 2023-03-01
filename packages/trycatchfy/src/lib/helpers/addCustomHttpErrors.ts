import { IHttpMappedErrorsHelper } from '../../index.d';
import { httpMappedErrorsHelper } from './mappedErrors';

export const addCustomHttpErrors = (
  customHttpErrors: IHttpMappedErrorsHelper[]
) => {
  customHttpErrors.forEach((error) => {
    httpMappedErrorsHelper.push(error);
  });
};
