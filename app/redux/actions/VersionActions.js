import { asyncFuncCreator } from '../utils';

export function index(key) {
  return asyncFuncCreator({
    constant: 'VERSION_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/version' })
  });
}

export function create(key, values) {
  return asyncFuncCreator({
    constant: 'VERSION_CREATE',
    promise: (client) => client.request({ url: '/project/' + key + '/version', method: 'post', data: values })
  });
}

export function edit(key, values) {
  return asyncFuncCreator({
    constant: 'VERSION_EDIT',
    promise: (client) => client.request({ url: '/project/' + key + '/version/' + values.id, method: 'put', data: values })
  });
}

export function show(id) {
  return { type: 'VERSION_SHOW', id: id };
}

export function delNotify(id) {
  return { type: 'VERSION_DELETE_NOTIFY', id: id };
}

export function del(key, id) {
  return asyncFuncCreator({
    constant: 'VERSION_DELETE',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/version/' + id, method: 'delete' })
  });
}
