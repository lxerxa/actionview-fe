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

export function edit(key, values) {
  return asyncFuncCreator({
    constant: 'SCREEN_EDIT',
    promise: (client) => client.request({ url: '/project/' + key + '/screen/' + values.id, method: 'put', data: values })
  });
}

export function show(key, id) {
  return asyncFuncCreator({
    constant: 'SCREEN_SHOW',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/screen/' + id })
  });
}

export function delNotify(id) {
  return { type: 'SCREEN_DELETE_NOTIFY', id: id };
}

export function del(key, id) {
  return asyncFuncCreator({
    constant: 'SCREEN_DELETE',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/screen/' + id, method: 'delete' })
  });
}
