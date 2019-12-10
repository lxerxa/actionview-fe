import { asyncFuncCreator } from '../utils';

export function index(year) {
  return asyncFuncCreator({
    constant: 'CALENDAR_INDEX',
    promise: (client) => client.request({ url: '/calendar/' + (year || 'current') })
  });
}

export function sync(year) {
  return asyncFuncCreator({
    constant: 'CALENDAR_SYNC',
    promise: (client) => client.request({ url: '/calendar/sync', method: 'post', data: { year } })
  });
}

export function update(values) {
  return asyncFuncCreator({
    constant: 'CALENDAR_UPDATE',
    promise: (client) => client.request({ url: '/calendar', method: 'post', data: values })
  });
}
