import { asyncFuncCreator } from '../utils';

export function fetch(id) {
  return asyncFuncCreator({
    constant: 'USER_INFO_FETCH',
    promise: (client) => client.request({ url: '/user/' + id})
  });
}

