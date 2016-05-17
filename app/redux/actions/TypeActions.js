import { asyncFuncCreator } from '../utils';

export function index(key) {
  return asyncFuncCreator({
    constant: 'TYPE_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/type' })
  });
}

export function init() {
  return { type: 'TYPE_INIT' };
}

export function create(key, values) {
  return asyncFuncCreator({
    constant: 'TYPE_CREATE',
    promise: (client) => client.request({ url: '/project/' + key + '/type', method: 'post', data: values })
  });
}

export function edit(key, values) {
  return asyncFuncCreator({
    constant: 'TYPE_EDIT',
    promise: (client) => client.request({ url: '/project/' + key + '/type', method: 'put', data: values })
  });
}

export function show(key, id) {
  return asyncFuncCreator({
    constant: 'TYPE_SHOW',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/type/' + id })
  });
}

export function delNotify(id) {
  return { type: 'TYPE_DELETE_NOTIFY', id: id };
}

export function del(key, id) {
  return asyncFuncCreator({
    constant: 'TYPE_DELETE',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/type/' + id, method: 'delete' })
  });
}
