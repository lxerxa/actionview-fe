import { asyncFuncCreator } from '../utils';

export function index(qs) {
  return asyncFuncCreator({
    constant: 'MYPROJECT_INDEX',
    promise: (client) => client.request({ url: '/myproject' + (qs ? '?' + qs : '') })
  });
}

export function more(qs) {
  return asyncFuncCreator({
    constant: 'MYPROJECT_MORE',
    promise: (client) => client.request({ url: '/myproject' + (qs ? '?' + qs : '') })
  });
}

export function create(values) {
  return asyncFuncCreator({
    constant: 'MYPROJECT_CREATE',
    promise: (client) => client.request({ url: '/project', method: 'post', data: values })
  });
}

export function edit(id, values) {
  return asyncFuncCreator({
    constant: 'MYPROJECT_EDIT',
    promise: (client) => client.request({ url: '/project/' + id, method: 'put', data: values })
  });
}

export function close(id) {
  return asyncFuncCreator({
    constant: 'MYPROJECT_CLOSE',
    promise: (client) => client.request({ url: '/project/' + id, method: 'put', data: { status: 'closed' } })
  });
}

export function reopen(id) {
  return asyncFuncCreator({
    constant: 'MYPROJECT_REOPEN',
    promise: (client) => client.request({ url: '/project/' + id, method: 'put', data: { status: 'active' } })
  });
}

export function show(id) {
  return { type: 'MYPROJECT_SHOW', id: id };
}
