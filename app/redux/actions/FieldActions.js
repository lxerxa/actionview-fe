import { asyncFuncCreator } from '../utils';

export function index(key) {
  return asyncFuncCreator({
    constant: 'FIELD_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/field' })
  });
}

export function create(key, values) {
  return asyncFuncCreator({
    constant: 'FIELD_CREATE',
    promise: (client) => client.request({ url: '/project/' + key + '/field', method: 'post', data: values })
  });
}

export function update(key, values) {
  return asyncFuncCreator({
    constant: 'FIELD_UPDATE',
    promise: (client) => client.request({ url: '/project/' + key + '/field/' + values.id, method: 'put', data: values })
  });
}

export function select(id) {
  return { type: 'FIELD_SELECT', id: id };
}

export function del(key, id) {
  return asyncFuncCreator({
    constant: 'FIELD_DELETE',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/field/' + id, method: 'delete' })
  });
}
