import { asyncFuncCreator } from '../utils';

export function index(key) {
  return asyncFuncCreator({
    constant: 'ACTIVITY_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/activity' })
  });
}
