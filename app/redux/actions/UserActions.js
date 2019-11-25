import { asyncFuncCreator } from '../utils';

export function resetpwdSendmail(values) {
  return asyncFuncCreator({
    constant: 'USER_PWD_RESET_SENDMAIL',
    promise: (client) => client.request({ url: '/user/resetpwdsendmail', data: values, method: 'post' })
  });
}

export function resetpwdAccess(code) {
  return asyncFuncCreator({
    constant: 'USER_PWD_RESET_ACCESS',
    promise: (client) => client.request({ url: '/user/resetpwd?code=' + code })
  });
}

export function resetpwd(values) {
  return asyncFuncCreator({
    constant: 'USER_PWD_RESET',
    promise: (client) => client.request({ url: '/user/resetpwd', data: values, method: 'post' })
  });
}

export function register(values) {
  return asyncFuncCreator({
    constant: 'USER_REGISTER',
    promise: (client) => client.request({ url: '/user/register', method: 'post', data: values })
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

export function imports(values) {
  return asyncFuncCreator({
    constant: 'USER_IMPORTS',
    promise: (client) => client.request({ url: '/user/imports', method: 'post', data: values })
  });
}

export function update(id, values) {
  return asyncFuncCreator({
    constant: 'USER_UPDATE',
    promise: (client) => client.request({ url: '/user/' + id, method: 'put', data: values })
  });
}

export function invalidate(id, flag) {
  return asyncFuncCreator({
    constant: 'USER_INVALIDATE',
    promise: (client) => client.request({ url: '/user/' + id, method: 'put', data: { invalid_flag: flag } })
  });
}

export function del(id) {
  return asyncFuncCreator({
    constant: 'USER_DELETE',
    id,
    promise: (client) => client.request({ url: '/user/' + id, method: 'delete' })
  });
}

export function renewPwd(id) {
  return asyncFuncCreator({
    constant: 'USER_PWD_RENEW',
    promise: (client) => client.request({ url: '/user/' + id + '/renewpwd' })
  });
}

export function select(id) {
  return { type: 'USER_SELECT', id: id };
}

export function multiDel(ids) {
  return asyncFuncCreator({
    constant: 'USER_MULTI_DELETE',
    ids,
    promise: (client) => client.request({ url: '/user/batch/delete', method: 'post', data: { ids } })
  });
}

export function multiRenewPwd(ids) {
  return asyncFuncCreator({
    constant: 'USER_MULTI_PWDRENEW',
    promise: (client) => client.request({ url: '/user/batch/renewpwd', method: 'post', data: { ids } })
  });
}

export function multiInvalidate(ids, flag) {
  return asyncFuncCreator({
    constant: 'USER_MULTI_INVALIDATE',
    flag,
    ids,
    promise: (client) => client.request({ url: '/user/batch/invalidate', method: 'post', data: { ids, flag } })
  });
}

export function setAvatar(id, data) {
  return asyncFuncCreator({
    constant: 'USER_SET_AVATAR',
    promise: (client) => client.request({ url: '/user/' + id + '/avatar', method: 'post', data })
  });
}
