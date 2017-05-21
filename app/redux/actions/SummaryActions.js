import { asyncFuncCreator } from '../utils';

export function index(key) {
  return asyncFuncCreator({
    constant: 'PROJECT_SUMMARY',
    promise: (client) => client.request({ url: '/project/' + key + '/summary' })
  });
}
