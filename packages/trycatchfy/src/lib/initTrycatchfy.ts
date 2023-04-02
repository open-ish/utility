import { IInitTrycatchfy } from './models';
import { addCustomHttpErrors } from './helpers/addCustomHttpErrors';
import { trycatchfy } from './helpers/trycatchfy';

/**
 * @param myCustomStatusCode (optional) is a array of custom handle http errors.
 */
export const initTrycatchfy = (params?: IInitTrycatchfy) => {
  addCustomHttpErrors(params?.customHttpErrors || []);

  return trycatchfy;
};
