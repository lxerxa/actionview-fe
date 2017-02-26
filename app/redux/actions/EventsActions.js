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

export function edit(key, values) {
  return asyncFuncCreator({
    constant: 'EVENTS_EDIT',
    promise: (client) => client.request({ url: '/project/' + key + '/events/' + values.id, method: 'put', data: values })
  });
}

export function show(id) {
  return { type: 'EVENTS_SHOW', id: id };
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
