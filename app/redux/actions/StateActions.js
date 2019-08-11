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

export function update(key, values) {
  return asyncFuncCreator({
    constant: 'STATE_UPDATE',
    promise: (client) => client.request({ url: '/project/' + key + '/state/' + values.id, method: 'put', data: values })
  });
}

export function select(id) {
  return { type: 'STATE_SELECT', id: id };
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
    promise: (client) => client.request({ url: '/project/' + key + '/state/batch', method: 'post', data: values })
  });
}

export function viewUsed(key, id) {
  return asyncFuncCreator({
    constant: 'STATE_VIEW_USED',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/state/' + id + '/used' })
  });
}
