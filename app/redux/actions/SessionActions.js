import { asyncFuncCreator } from '../utils';

export function create(values) {
  return asyncFuncCreator({
    constant: 'SESSION_CREATE',
    promise: (client) => client.request({ url: '/session', method: 'post' }, values)
  });
}
