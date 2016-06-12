import { asyncFuncCreator } from '../utils';

export function index(key) {
  return asyncFuncCreator({
    constant: 'STATE_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/state' })
  });
}

export function init() {
  return { type: 'STATE_INIT' };
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

export function show(key, id) {
  return asyncFuncCreator({
    constant: 'STATE_SHOW',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/state/' + id })
  });
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

export function setSort(key, values) {
  return asyncFuncCreator({
    constant: 'STATE_SET_SORT',
    promise: (client) => client.request({ url: '/project/' + key + '/state', method: 'put', data: values })
  });
}

export function setDefault(key, values) {
  return asyncFuncCreator({
    constant: 'STATE_SET_DEFAULT',
    promise: (client) => client.request({ url: '/project/' + key + '/state', method: 'put', data: values })
  });
}
