import { asyncFuncCreator } from '../utils';

export function index(key) {
  return asyncFuncCreator({
    constant: 'ROLE_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/role' })
  });
}

export function create(key, values) {
  return asyncFuncCreator({
    constant: 'ROLE_CREATE',
    promise: (client) => client.request({ url: '/project/' + key + '/role', method: 'post', data: values })
  });
}

export function update(key, values) {
  return asyncFuncCreator({
    constant: 'ROLE_UPDATE',
    promise: (client) => client.request({ url: '/project/' + key + '/role/' + values.id, method: 'put', data: values })
  });
}

export function select(id) {
  return { type: 'ROLE_SELECT', id: id };
}

export function del(key, id) {
  return asyncFuncCreator({
    constant: 'ROLE_DELETE',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/role/' + id, method: 'delete' })
  });
}
