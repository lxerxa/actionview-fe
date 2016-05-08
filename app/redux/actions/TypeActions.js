import { asyncFuncCreator } from '../utils';

export function index(key) {
  return asyncFuncCreator({
    constant: 'TYPE_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/type' })
  });
}

export function create(values) {
  return asyncFuncCreator({
    constant: 'TYPE_CREATE',
    promise: (client) => client.request({ url: '/type', method: 'post', data: values })
  });
}
