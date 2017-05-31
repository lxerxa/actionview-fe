import { asyncFuncCreator } from '../utils';

export function index(key) {
  return asyncFuncCreator({
    constant: 'PROJECT_CONFIG',
    promise: (client) => client.request({ url: '/project/' + key + '/config' })
  });
}
