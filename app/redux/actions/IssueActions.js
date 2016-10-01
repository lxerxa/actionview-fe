import { asyncFuncCreator } from '../utils';

export function index(key) {
  return asyncFuncCreator({
    constant: 'ISSUE_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/issue' })
  });
}

export function create(key, values) {
  return asyncFuncCreator({
    constant: 'ISSUE_CREATE',
    promise: (client) => client.request({ url: '/project/' + key + '/issue', method: 'post', data: values })
  });
}

export function edit(key, values) {
  return asyncFuncCreator({
    constant: 'ISSUE_EDIT',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/' + values.id, method: 'put', data: values })
  });
}

export function show(id) {
  return { type: 'ISSUE_SHOW', id: id };
}

export function delNotify(id) {
  return { type: 'ISSUE_DELETE_NOTIFY', id: id };
}

export function del(key, id) {
  return asyncFuncCreator({
    constant: 'ISSUE_DELETE',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/issue/' + id, method: 'delete' })
  });
}
