import { asyncFuncCreator } from '../utils';

export function index(key, qs) {
  return asyncFuncCreator({
    constant: 'LABELS_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/labels' + (qs ? '?' + qs : '') })
  });
}

export function create(key, values) {
  return asyncFuncCreator({
    constant: 'LABELS_CREATE',
    promise: (client) => client.request({ url: '/project/' + key + '/labels', method: 'post', data: values })
  });
}

export function update(key, values) {
  return asyncFuncCreator({
    constant: 'LABELS_UPDATE',
    promise: (client) => client.request({ url: '/project/' + key + '/labels/' + values.id, method: 'put', data: values })
  });
}

export function select(id) {
  return { type: 'LABELS_SELECT', id: id };
}

export function del(key, values) {
  return asyncFuncCreator({
    constant: 'LABELS_DELETE',
    id: values.id,
    promise: (client) => client.request({ url: '/project/' + key + '/labels/' + values.id + '/delete', data: values, method: 'post' })
  });
}
