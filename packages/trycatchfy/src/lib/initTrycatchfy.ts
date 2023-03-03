import { IInitTrycatchfy } from './models';
import { addCustomHttpErrors } from './helpers/addCustomHttpErrors';
import { trycatchfy } from './helpers/trycatchfy';

export const initTrycatchfy = (params?: IInitTrycatchfy) => {
  addCustomHttpErrors(params?.customHttpErrors || []);

  return trycatchfy;
};
