import { asyncFuncCreator } from '../utils';

export function index() {
  return asyncFuncCreator({
    constant: 'PROJECTS_INDEX',
    promise: (client) => client.request({ url: '/projects' })
  });
}

