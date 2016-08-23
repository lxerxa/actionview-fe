import { asyncFuncCreator } from '../utils';

export function index(key, id) {
  return asyncFuncCreator({
    constant: 'WFCONFIG_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/workflow/' + id + '/steps' })
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

export function addAction(values) {
  return { type: 'WFCONFIG_ACTION_ADD', values: values };
}

export function editAction(values) {
  return { type: 'WFCONFIG_ACTION_EDIT', values: values };
}

export function delAction(id) {
  return { type: 'WFCONFIG_ACTION_DELETE', id: id };
}

