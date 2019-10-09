import { asyncFuncCreator } from '../utils';

export function index(key) {
  return asyncFuncCreator({
    constant: 'INTEGRATIONS_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/integrations' })
  });
}

export function handle(key, values) {
  return asyncFuncCreator({
    constant: 'INTEGRATIONS_HANDLE',
    promise: (client) => client.request({ url: '/project/' + key + '/integrations', method: 'post', data: values })
  });
}
