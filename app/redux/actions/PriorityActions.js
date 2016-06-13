import { asyncFuncCreator } from '../utils';

export function index(key) {
  return asyncFuncCreator({
    constant: 'PRIORITY_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/priority' })
  });
}

export function create(key, values) {
  return asyncFuncCreator({
    constant: 'PRIORITY_CREATE',
    promise: (client) => client.request({ url: '/project/' + key + '/priority', method: 'post', data: values })
  });
}

export function edit(key, values) {
  return asyncFuncCreator({
    constant: 'PRIORITY_EDIT',
    promise: (client) => client.request({ url: '/project/' + key + '/priority/' + values.id, method: 'put', data: values })
  });
}

export function show(key, id) {
  return asyncFuncCreator({
    constant: 'PRIORITY_SHOW',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/priority/' + id })
  });
}

export function delNotify(id) {
  return { type: 'PRIORITY_DELETE_NOTIFY', id: id };
}

export function del(key, id) {
  return asyncFuncCreator({
    constant: 'PRIORITY_DELETE',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/priority/' + id, method: 'delete' })
  });
}

export function setSort(key, values) {
  return asyncFuncCreator({
    constant: 'PRIORITY_SET_SORT',
    promise: (client) => client.request({ url: '/project/' + key + '/priority', method: 'put', data: values })
  });
}

export function setDefault(key, values) {
  return asyncFuncCreator({
    constant: 'PRIORITY_SET_DEFAULT',
    promise: (client) => client.request({ url: '/project/' + key + '/priority', method: 'put', data: values })
  });
}
