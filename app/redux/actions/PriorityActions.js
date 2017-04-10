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

export function update(key, values) {
  return asyncFuncCreator({
    constant: 'PRIORITY_UPDATE',
    promise: (client) => client.request({ url: '/project/' + key + '/priority/' + values.id, method: 'put', data: values })
  });
}

export function select(id) {
  return { type: 'PRIORITY_SELECT', id: id };
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
    promise: (client) => client.request({ url: '/project/' + key + '/priority/batch', method: 'post', data: values })
  });
}

export function setDefault(key, values) {
  return asyncFuncCreator({
    constant: 'PRIORITY_SET_DEFAULT',
    promise: (client) => client.request({ url: '/project/' + key + '/priority/batch', method: 'post', data: values })
  });
}
