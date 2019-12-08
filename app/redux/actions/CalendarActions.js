import { asyncFuncCreator } from '../utils';

export function index(year) {
  return asyncFuncCreator({
    constant: 'CALENDAR_INDEX',
    promise: (client) => client.request({ url: '/calendar?year=' + (year || 'current') })
  });
}

export function sync(year) {
  return asyncFuncCreator({
    constant: 'CALENDAR_SYNC',
    promise: (client) => client.request({ url: '/calendar/sync', method: 'post', data: { year } })
  });
}

export function set(values) {
  return asyncFuncCreator({
    constant: 'CALENDAR_SETTING',
    promise: (client) => client.request({ url: '/calendar', method: 'post', data: values })
  });
}
