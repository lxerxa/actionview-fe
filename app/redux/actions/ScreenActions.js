import { asyncFuncCreator } from '../utils';

export function index(key) {
  return asyncFuncCreator({
    constant: 'SCREEN_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/screen' })
  });
}

export function create(key, values) {
  return asyncFuncCreator({
    constant: 'SCREEN_CREATE',
    promise: (client) => client.request({ url: '/project/' + key + '/screen', method: 'post', data: values })
  });
}

export function update(key, values) {
  return asyncFuncCreator({
    constant: 'SCREEN_UPDATE',
    promise: (client) => client.request({ url: '/project/' + key + '/screen/' + values.id, method: 'put', data: values })
  });
}

export function select(id) {
  return { type: 'SCREEN_SELECT', id: id };
}

export function del(key, id) {
  return asyncFuncCreator({
    constant: 'SCREEN_DELETE',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/screen/' + id, method: 'delete' })
  });
}

export function viewUsed(key, id) {
  return asyncFuncCreator({
    constant: 'SCREEN_VIEW_USED',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/screen/' + id + '/used' })
  });
}
