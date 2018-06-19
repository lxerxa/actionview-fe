import { asyncFuncCreator } from '../utils';

export function index() {
  return asyncFuncCreator({
    constant: 'DIRECTORY_INDEX',
    promise: (client) => client.request({ url: '/directory' })
  });
}

export function create(values) {
  return asyncFuncCreator({
    constant: 'DIRECTORY_CREATE',
    promise: (client) => client.request({ url: '/directory', method: 'post', data: values })
  });
}

export function update(id, values) {
  return asyncFuncCreator({
    constant: 'DIRECTORY_UPDATE',
    promise: (client) => client.request({ url: '/directory/' + id, method: 'put', data: values })
  });
}

export function invalidate(id, flag) {
  return asyncFuncCreator({
    constant: 'DIRECTORY_INVALIDATE',
    promise: (client) => client.request({ url: '/directory/' + id, method: 'put', data: { invalid_flag : flag } })
  });
}

export function del(id) {
  return asyncFuncCreator({
    constant: 'DIRECTORY_DELETE',
    id,
    promise: (client) => client.request({ url: '/directory/' + id, method: 'delete' })
  });
}

export function select(id) {
  return { type: 'DIRECTORY_SELECT', id: id };
}

export function test(id) {
  return asyncFuncCreator({
    constant: 'DIRECTORY_TEST',
    promise: (client) => client.request({ url: '/directory/' + id + '/test' })
  });
}

export function sync(id) {
  return asyncFuncCreator({
    constant: 'DIRECTORY_SYNC',
    promise: (client) => client.request({ url: '/directory/' + id + '/sync' })
  });
}
