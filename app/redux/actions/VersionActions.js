import { asyncFuncCreator } from '../utils';

export function index(key) {
  return asyncFuncCreator({
    constant: 'VERSION_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/version' })
  });
}

export function create(key, values) {
  return asyncFuncCreator({
    constant: 'VERSION_CREATE',
    promise: (client) => client.request({ url: '/project/' + key + '/version', method: 'post', data: values })
  });
}

export function update(key, values) {
  return asyncFuncCreator({
    constant: 'VERSION_UPDATE',
    promise: (client) => client.request({ url: '/project/' + key + '/version/' + values.id, method: 'put', data: values })
  });
}

export function select(id) {
  return { type: 'VERSION_SELECT', id: id };
}

export function del(key, id) {
  return asyncFuncCreator({
    constant: 'VERSION_DELETE',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/version/' + id, method: 'delete' })
  });
}
