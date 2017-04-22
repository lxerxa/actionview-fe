import { asyncFuncCreator } from '../utils';

export function index() {
  return asyncFuncCreator({
    constant: 'SCHEME_INDEX',
    promise: (client) => client.request({ url: '/scheme' })
  });
}

export function create(values) {
  return asyncFuncCreator({
    constant: 'SCHEME_CREATE',
    promise: (client) => client.request({ url: '/scheme', method: 'post', data: values })
  });
}

export function update(id, values) {
  return asyncFuncCreator({
    constant: 'SCHEME_UPDATE',
    promise: (client) => client.request({ url: '/scheme/' + id, method: 'put', data: values })
  });
}

export function select(id) {
  return { type: 'SCHEME_SELECT', id: id };
}

export function del(id) {
  return asyncFuncCreator({
    constant: 'SCHEME_DELETE',
    id,
    promise: (client) => client.request({ url: '/scheme/' + id, method: 'delete' })
  });
}
