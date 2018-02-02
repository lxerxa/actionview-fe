import { asyncFuncCreator } from '../utils';

export function index(key, id) {
  return asyncFuncCreator({
    constant: 'WFCONFIG_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/workflow/' + id })
  });
}

export function save(key, id, values) {
  return asyncFuncCreator({
    constant: 'WFCONFIG_SAVE',
    promise: (client) => client.request({ url: '/project/' + key + '/workflow/' + id, method: 'put', data: values })
  });
}

export function createStep(values) {
  return { type: 'WFCONFIG_STEP_CREATE', values: values };
}

export function editStep(values) {
  return { type: 'WFCONFIG_STEP_EDIT', values: values };
}

export function delStep(id) {
  return { type: 'WFCONFIG_STEP_DELETE', id: id };
}

export function addAction(stepId, values) {
  return { type: 'WFCONFIG_ACTION_ADD', stepId, values };
}

export function editAction(stepId, values) {
  return { type: 'WFCONFIG_ACTION_EDIT', stepId, values };
}

export function delAction(stepId, values) {
  return { type: 'WFCONFIG_ACTION_DELETE', stepId, values };
}

export function cancel() {
  return { type: 'WFCONFIG_CANCEL' };
}

