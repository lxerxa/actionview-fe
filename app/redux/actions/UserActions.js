import { asyncFuncCreator } from '../utils';

export function resetpwd(email) {
  return asyncFuncCreator({
    constant: 'USER_PWD_RESET',
    promise: (client) => client.request({ url: '/user/resetpwd?email=' + email })
  });
}

export function register(values) {
  return asyncFuncCreator({
    constant: 'USER_REGISTER',
    promise: (client) => client.request({ url: '/user', method: 'post', data: values })
  });
}

export function index(qs) {
  return asyncFuncCreator({
    constant: 'USER_INDEX',
    promise: (client) => client.request({ url: '/user' + (qs ? '?' + qs : '') })
  });
}

export function create(values) {
  return asyncFuncCreator({
    constant: 'USER_CREATE',
    promise: (client) => client.request({ url: '/user', method: 'post', data: values })
  });
}

export function update(id, values) {
  return asyncFuncCreator({
    constant: 'USER_UPDATE',
    promise: (client) => client.request({ url: '/user/' + id, method: 'put', data: values })
  });
}

export function close(id) {
  return asyncFuncCreator({
    constant: 'USER_CLOSE',
    promise: (client) => client.request({ url: '/user/' + id, method: 'put', data: { status: 'closed' } })
  });
}

export function reopen(id) {
  return asyncFuncCreator({
    constant: 'USER_REOPEN',
    promise: (client) => client.request({ url: '/user/' + id, method: 'put', data: { status: 'active' } })
  });
}

export function select(id) {
  return { type: 'USER_SELECT', id: id };
}

export function multiReopen(ids) {
  return asyncFuncCreator({
    constant: 'USER_MULTI_REOPEN',
    ids,
    promise: (client) => client.request({ url: '/user/batch/status', method: 'post', data: { ids, status: 'active' } })
  });
}

export function multiClose(ids) {
  return asyncFuncCreator({
    constant: 'USER_MULTI_CLOSE',
    ids,
    promise: (client) => client.request({ url: '/user/batch/status', method: 'post', data: { ids, status: 'closed' } })
  });
}
