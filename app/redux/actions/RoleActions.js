import { asyncFuncCreator } from '../utils';

export function index(key) {
  return asyncFuncCreator({
    constant: 'ROLE_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/role' })
  });
}

export function create(key, values) {
  return asyncFuncCreator({
    constant: 'ROLE_CREATE',
    promise: (client) => client.request({ url: '/project/' + key + '/role', method: 'post', data: values })
  });
}

export function edit(key, values) {
  return asyncFuncCreator({
    constant: 'ROLE_EDIT',
    promise: (client) => client.request({ url: '/project/' + key + '/role/' + values.id, method: 'put', data: values })
  });
}

export function show(id) {
  return { type: 'ROLE_SHOW', id: id };
}

export function delNotify(id) {
  return { type: 'ROLE_DELETE_NOTIFY', id: id };
}

export function del(key, id) {
  return asyncFuncCreator({
    constant: 'ROLE_DELETE',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/role/' + id, method: 'delete' })
  });
}
