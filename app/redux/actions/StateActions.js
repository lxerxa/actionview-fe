import { asyncFuncCreator } from '../utils';

export function index(key) {
  return asyncFuncCreator({
    constant: 'STATE_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/state' })
  });
}

export function create(key, values) {
  return asyncFuncCreator({
    constant: 'STATE_CREATE',
    promise: (client) => client.request({ url: '/project/' + key + '/state', method: 'post', data: values })
  });
}

export function edit(key, values) {
  return asyncFuncCreator({
    constant: 'STATE_EDIT',
    promise: (client) => client.request({ url: '/project/' + key + '/state/' + values.id, method: 'put', data: values })
  });
}

export function show(id) {
  return { type: 'STATE_SHOW', id: id };
}

export function delNotify(id) {
  return { type: 'STATE_DELETE_NOTIFY', id: id };
}

export function del(key, id) {
  return asyncFuncCreator({
    constant: 'STATE_DELETE',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/state/' + id, method: 'delete' })
  });
}
