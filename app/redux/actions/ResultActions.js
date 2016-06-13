import { asyncFuncCreator } from '../utils';

export function index(key) {
  return asyncFuncCreator({
    constant: 'RESULT_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/result' })
  });
}

export function create(key, values) {
  return asyncFuncCreator({
    constant: 'RESULT_CREATE',
    promise: (client) => client.request({ url: '/project/' + key + '/result', method: 'post', data: values })
  });
}

export function edit(key, values) {
  return asyncFuncCreator({
    constant: 'RESULT_EDIT',
    promise: (client) => client.request({ url: '/project/' + key + '/result/' + values.id, method: 'put', data: values })
  });
}

export function show(key, id) {
  return asyncFuncCreator({
    constant: 'RESULT_SHOW',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/result/' + id })
  });
}

export function delNotify(id) {
  return { type: 'RESULT_DELETE_NOTIFY', id: id };
}

export function del(key, id) {
  return asyncFuncCreator({
    constant: 'RESULT_DELETE',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/result/' + id, method: 'delete' })
  });
}

export function setSort(key, values) {
  return asyncFuncCreator({
    constant: 'RESULT_SET_SORT',
    promise: (client) => client.request({ url: '/project/' + key + '/result', method: 'put', data: values })
  });
}

export function setDefault(key, values) {
  return asyncFuncCreator({
    constant: 'RESULT_SET_DEFAULT',
    promise: (client) => client.request({ url: '/project/' + key + '/result', method: 'put', data: values })
  });
}
