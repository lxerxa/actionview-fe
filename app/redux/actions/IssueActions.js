import { asyncFuncCreator } from '../utils';

export function index(key, qs) {
  return asyncFuncCreator({
    constant: 'ISSUE_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/issue' + (qs ? '?' + qs : '') })
  });
}

export function create(key, values) {
  return asyncFuncCreator({
    constant: 'ISSUE_CREATE',
    promise: (client) => client.request({ url: '/project/' + key + '/issue', method: 'post', data: values })
  });
}

export function edit(key, values) {
  return asyncFuncCreator({
    constant: 'ISSUE_EDIT',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/' + values.id, method: 'put', data: values })
  });
}

export function getOptions(key) {
  return asyncFuncCreator({
    constant: 'ISSUE_OPTIONS',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/options' })
  });
}

export function addSearcher(key, values) {
  return asyncFuncCreator({
    constant: 'ISSUE_SEARCHER_ADD',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/searcher', method: 'post', data: values })
  });
}

export function delSearcher(key, id) {
  return asyncFuncCreator({
    constant: 'ISSUE_SEARCHER_DELETE',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/issue/searcher/' + id, method: 'delete' })
  });
}

export function show(key, id) {
  return asyncFuncCreator({
    constant: 'ISSUE_SHOW',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/' + id })
  });
}

export function delNotify(id) {
  return { type: 'ISSUE_DELETE_NOTIFY', id: id };
}

export function del(key, id) {
  return asyncFuncCreator({
    constant: 'ISSUE_DELETE',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/issue/' + id, method: 'delete' })
  });
}
