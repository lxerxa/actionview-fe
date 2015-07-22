import { asyncFuncCreator } from '../utils';

export function load() {
  return asyncFuncCreator({
    CONSTANT: 'README_LOAD',
    promise: (client) => client.request({ url: '/readme' })
  });
}
