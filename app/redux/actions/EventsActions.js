import { asyncFuncCreator } from '../utils';

export function index(key) {
  return asyncFuncCreator({
    constant: 'EVENTS_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/events' })
  });
}

export function create(key, values) {
  return asyncFuncCreator({
    constant: 'EVENTS_CREATE',
    promise: (client) => client.request({ url: '/project/' + key + '/events', method: 'post', data: values })
  });
}

export function update(key, values) {
  return asyncFuncCreator({
    constant: 'EVENTS_UPDATE',
    promise: (client) => client.request({ url: '/project/' + key + '/events/' + values.id, method: 'put', data: values })
  });
}

export function setNotify(key, values) {
  return asyncFuncCreator({
    constant: 'EVENTS_SET_NOTIFY',
    promise: (client) => client.request({ url: '/project/' + key + '/events/' + values.id + '/notify', method: 'post', data: values })
  });
}

export function select(id) {
  return { type: 'EVENTS_SELECT', id: id };
}

export function del(key, id) {
  return asyncFuncCreator({
    constant: 'EVENTS_DELETE',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/events/' + id, method: 'delete' })
  });
}

export function reset(key, id) {
  return asyncFuncCreator({
    constant: 'EVENTS_RESET',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/events/' + id + '/reset' })
  });
}
