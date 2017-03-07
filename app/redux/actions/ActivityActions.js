import { asyncFuncCreator } from '../utils';

export function index(key, qs) {
  return asyncFuncCreator({
    constant: 'ACTIVITY_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/activity' + (qs ? '?' + qs : '') })
  });
}

export function more(key, qs) {
  return asyncFuncCreator({
    constant: 'ACTIVITY_MORE',
    promise: (client) => client.request({ url: '/project/' + key + '/activity' + (qs ? '?' + qs : '') })
  });
}
