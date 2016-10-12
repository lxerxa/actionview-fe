import { asyncFuncCreator } from '../utils';

export function index(key, query) {
  return asyncFuncCreator({
    constant: 'TYPE_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/type' })
  });
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
    promise: (client) => client.request({ url: '/project/' + key + '/type/' + values.id, method: 'put', data: values })
  });
}

export function show(id) {
  return { type: 'TYPE_SHOW', id: id };
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

export function setSort(key, values) {
  return asyncFuncCreator({
    constant: 'TYPE_SET_SORT',
    promise: (client) => client.request({ url: '/project/' + key + '/type/batch', method: 'post', data: values })
  });
}

export function setDefault(key, values) {
  return asyncFuncCreator({
    constant: 'TYPE_SET_DEFAULT',
    promise: (client) => client.request({ url: '/project/' + key + '/type/batch', method: 'post', data: values })
  });
}
