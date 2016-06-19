import { asyncFuncCreator } from '../utils';

export function index(key) {
  return asyncFuncCreator({
    constant: 'ROLEACTOR_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/roleactor' })
  });
}

export function edit(key, values) {
  return asyncFuncCreator({
    constant: 'ROLEACTOR_EDIT',
    promise: (client) => client.request({ url: '/project/' + key + '/roleactor/' + values.id, method: 'put', data: values })
  });
}
