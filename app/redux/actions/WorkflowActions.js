import { asyncFuncCreator } from '../utils';

export function index(key) {
  return asyncFuncCreator({
    constant: 'WORKFLOW_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/workflow' })
  });
}

export function create(key, values) {
  return asyncFuncCreator({
    constant: 'WORKFLOW_CREATE',
    promise: (client) => client.request({ url: '/project/' + key + '/workflow', method: 'post', data: values })
  });
}

export function edit(key, values) {
  return asyncFuncCreator({
    constant: 'WORKFLOW_EDIT',
    promise: (client) => client.request({ url: '/project/' + key + '/workflow/' + values.id, method: 'put', data: values })
  });
}

export function show(id) {
  return { type: 'WORKFLOW_SHOW', id: id };
}

export function delNotify(id) {
  return { type: 'WORKFLOW_DELETE_NOTIFY', id: id };
}

export function del(key, id) {
  return asyncFuncCreator({
    constant: 'WORKFLOW_DELETE',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/workflow/' + id, method: 'delete' })
  });
}

export function preview(key, id) {
  return asyncFuncCreator({
    constant: 'WORKFLOW_PREVIEW',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/workflow/' + id + '?flag=s' })
  });
}
