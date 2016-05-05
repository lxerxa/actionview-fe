import { asyncFuncCreator } from '../utils';

export function index() {
  return asyncFuncCreator({
    constant: 'ISSUE_INDEX',
    promise: (client) => client.request({ url: '/issue' })
  });
}

export function create(values) {
  return asyncFuncCreator({
    constant: 'ISSUE_CREATE',
    promise: (client) => client.request({ url: '/issue', method: 'post', data: values })
  });
}
