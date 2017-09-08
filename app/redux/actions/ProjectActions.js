import { asyncFuncCreator } from '../utils';

export function index(qs) {
  return asyncFuncCreator({
    constant: 'PROJECT_INDEX',
    promise: (client) => client.request({ url: '/project' + (qs ? '?' + qs : '') })
  });
}

export function myIndex(qs) {
  return asyncFuncCreator({
    constant: 'PROJECT_INDEX',
    promise: (client) => client.request({ url: '/myproject' + (qs ? '?' + qs : '') })
  });
}

export function more(qs) {
  return asyncFuncCreator({
    constant: 'PROJECT_MORE',
    promise: (client) => client.request({ url: '/myproject' + (qs ? '?' + qs : '') })
  });
}

export function create(values) {
  return asyncFuncCreator({
    constant: 'PROJECT_CREATE',
    promise: (client) => client.request({ url: '/project', method: 'post', data: values })
  });
}

export function update(id, values) {
  return asyncFuncCreator({
    constant: 'PROJECT_UPDATE',
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

export function createIndex(id) {
  return asyncFuncCreator({
    constant: 'PROJECT_CREATEINDEX',
    promise: (client) => client.request({ url: '/project/' + id + '/createindex' })
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
    promise: (client) => client.request({ url: '/project/recent' })
  });
}

export function getOptions() {
  return asyncFuncCreator({
    constant: 'PROJECT_OPTIONS',
    promise: (client) => client.request({ url: '/project/options' })
  });
}

export function select(id) {
  return { type: 'PROJECT_SELECT', id: id };
}

export function multiReopen(ids) {
  return asyncFuncCreator({
    constant: 'PROJECT_MULTI_REOPEN',
    ids,
    promise: (client) => client.request({ url: '/project/batch/status', method: 'post', data: { ids, status: 'active' } })
  });
}

export function multiClose(ids) {
  return asyncFuncCreator({
    constant: 'PROJECT_MULTI_CLOSE',
    ids,
    promise: (client) => client.request({ url: '/project/batch/status', method: 'post', data: { ids, status: 'closed' } })
  });
}

export function multiCreateIndex(ids) {
  return asyncFuncCreator({
    constant: 'PROJECT_MULTI_CREATEINDEX',
    ids,
    promise: (client) => client.request({ url: '/project/batch/createindex', method: 'post', data: { ids } })
  });
}

export function cleanSelectedProject() {
  return { type: 'PROJECT_CLEAN_SELECTED' };
}

