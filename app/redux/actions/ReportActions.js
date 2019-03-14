import { asyncFuncCreator } from '../utils';

export function index(key) {
  return asyncFuncCreator({
    constant: 'REPORT_LIST',
    promise: (client) => client.request({ url: '/project/' + key + '/report/index' })
  });
}

export function worklog(key, qs) {
  return asyncFuncCreator({
    constant: 'REPORT_WORKLOG',
    promise: (client) => client.request({ url: '/project/' + key + '/report/worklog' + (qs ? '?' + qs : '') })
  });
}
