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

export function update(key, values) {
  return asyncFuncCreator({
    constant: 'TYPE_UPDATE',
    promise: (client) => client.request({ url: '/project/' + key + '/type/' + values.id, method: 'put', data: values })
  });
}

export function select(id) {
  return { type: 'TYPE_SELECT', id: id };
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
