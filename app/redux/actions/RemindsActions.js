import { asyncFuncCreator } from '../utils';

export function index(key, qs) {
  return asyncFuncCreator({
    constant: 'REMINDS_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/reminds' + (qs ? '?' + qs : '') })
  });
}

export function create(key, values) {
  return asyncFuncCreator({
    constant: 'REMINDS_CREATE',
    promise: (client) => client.request({ url: '/project/' + key + '/reminds', method: 'post', data: values })
  });
}

export function update(key, values) {
  return asyncFuncCreator({
    constant: 'REMINDS_UPDATE',
    promise: (client) => client.request({ url: '/project/' + key + '/reminds/' + values.id, method: 'put', data: values })
  });
}

export function select(id) {
  return { type: 'REMINDS_SELECT', id: id };
}

export function del(key, values) {
  return asyncFuncCreator({
    constant: 'REMINDS_DELETE',
    id: values.id,
    promise: (client) => client.request({ url: '/project/' + key + '/reminds/' + values.id + '/delete', data: values, method: 'post' })
  });
}
