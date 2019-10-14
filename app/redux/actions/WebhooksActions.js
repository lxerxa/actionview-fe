import { asyncFuncCreator } from '../utils';

export function index(key) {
  return asyncFuncCreator({
    constant: 'WEBHOOKS_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/webhooks' })
  });
}

export function create(key, values) {
  return asyncFuncCreator({
    constant: 'WEBHOOKS_CREATE',
    promise: (client) => client.request({ url: '/project/' + key + '/webhooks', method: 'post', data: values })
  });
}

export function update(key, id, values) {
  return asyncFuncCreator({
    constant: 'WEBHOOKS_UPDATE',
    promise: (client) => client.request({ url: '/project/' + key + '/webhooks/' + id, method: 'put', data: values })
  });
}

export function test(key, id) {
  return asyncFuncCreator({
    constant: 'WEBHOOKS_TEST',
    promise: (client) => client.request({ url: '/project/' + key + '/webhooks/' + id + '/test', method: 'get' })
  });
}

export function del(key, id) {
  return asyncFuncCreator({
    constant: 'WEBHOOKS_DELETE',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/webhooks/' + id, method: 'delete' })
  });
}

export function select(id) {
  return { type: 'WEBHOOKS_SELECT', id: id };
}
