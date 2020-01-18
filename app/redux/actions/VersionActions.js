import { asyncFuncCreator } from '../utils';

export function index(key, qs) {
  return asyncFuncCreator({
    constant: 'VERSION_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/version' + (qs ? '?' + qs : '') })
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

export function release(key, values) {
  return asyncFuncCreator({
    constant: 'VERSION_RELEASE',
    promise: (client) => client.request({ url: '/project/' + key + '/version/' + values.id + '/release', method: 'post', data: values })
  });
}

export function merge(key, values) {
  return asyncFuncCreator({
    constant: 'VERSION_MERGE',
    source: values.source || '',
    dest: values.dest || '',
    promise: (client) => client.request({ url: '/project/' + key + '/version/merge', data: values, method: 'post' })
  });
}

export function select(id) {
  return { type: 'VERSION_SELECT', id: id };
}

export function del(key, values) {
  return asyncFuncCreator({
    constant: 'VERSION_DELETE',
    id: values.id,
    promise: (client) => client.request({ url: '/project/' + key + '/version/' + values.id + '/delete', data: values, method: 'post' })
  });
}
