import { asyncFuncCreator } from '../utils';

export function index(key) {
  return asyncFuncCreator({
    constant: 'REPORT_LIST',
    promise: (client) => client.request({ url: '/project/' + key + '/report' })
  });
}
