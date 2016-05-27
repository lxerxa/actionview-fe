import { asyncFuncCreator } from '../utils';

export function index(key) {
  return asyncFuncCreator({
    constant: 'FIELD_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/field' })
  });
}

export function create(key, values) {
  return asyncFuncCreator({
    constant: 'FIELD_CREATE',
    promise: (client) => client.request({ url: '/project/' + key + '/field', method: 'post', data: values })
  });
}

export function edit(key, values) {
  return asyncFuncCreator({
    constant: 'FIELD_EDIT',
    promise: (client) => client.request({ url: '/project/' + key + '/field/' + values.id, method: 'put', data: values })
  });
}

export function show(key, id) {
  return asyncFuncCreator({
    constant: 'FIELD_SHOW',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/field/' + id })
  });
}

export function delNotify(id) {
  return { type: 'FIELD_DELETE_NOTIFY', id: id };
}

export function del(key, id) {
  return asyncFuncCreator({
    constant: 'FIELD_DELETE',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/field/' + id, method: 'delete' })
  });
}
