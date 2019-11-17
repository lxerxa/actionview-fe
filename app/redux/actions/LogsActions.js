import { asyncFuncCreator } from '../utils';

export function index(qs) {
  return asyncFuncCreator({
    constant: 'LOGS_INDEX',
    promise: (client) => client.request({ url: '/logs' + (qs ? '?' + qs : '') })
  });
}
