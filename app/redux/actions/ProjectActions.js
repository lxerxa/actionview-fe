import { asyncFuncCreator } from '../utils';

export function index(qs) {
  return asyncFuncCreator({
    constant: 'PROJECT_INDEX',
    promise: (client) => client.request({ url: '/project' + (qs ? '?' + qs : '') })
  });
}

export function create(values) {
  return asyncFuncCreator({
    constant: 'PROJECT_CREATE',
    promise: (client) => client.request({ url: '/project', method: 'post', data: values })
  });
}

export function edit(id, values) {
  return asyncFuncCreator({
    constant: 'PROJECT_EDIT',
    promise: (client) => client.request({ url: '/project/' + id, method: 'put', data: values })
  });
}

export function close(id) {
  return asyncFuncCreator({
    constant: 'PROJECT_CLOSE',
    promise: (client) => client.request({ url: '/project/' + id, method: 'put', data: { status: 'closed' } })
  });
}

export function reopen(id) {
  return asyncFuncCreator({
    constant: 'PROJECT_REOPEN',
    promise: (client) => client.request({ url: '/project/' + id, method: 'put', data: { status: 'active' } })
  });
}

export function show(id) {
  return asyncFuncCreator({
    constant: 'PROJECT_SHOW',
    promise: (client) => client.request({ url: '/project/' + id, method: 'get' })
  });
}

export function recents() {
  return asyncFuncCreator({
    constant: 'PROJECT_RECENTS',
    promise: (client) => client.request({ url: '/myproject' + '?status=active&limit=5' })
  });
}

export function getOptions() {
  return asyncFuncCreator({
    constant: 'PROJECT_OPTIONS',
    promise: (client) => client.request({ url: '/project/options' })
  });
}
