import { asyncFuncCreator } from '../utils';

export function load() {
  return asyncFuncCreator({
    constant: 'README_LOAD',
    promise: (client) => client.request({ url: '/readme' })
  });
}
