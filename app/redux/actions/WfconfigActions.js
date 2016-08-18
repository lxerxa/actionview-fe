import { asyncFuncCreator } from '../utils';

export function index(key, id) {
  return asyncFuncCreator({
    constant: 'WFCONFIG_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/workflow/' + id + '/steps' })
  });
}

export function createStep(values) {
  return { type: 'WFCONFIG_CREATE_STEP', step: values };
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
