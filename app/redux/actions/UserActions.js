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

export function setAvatar(id, data) {
  return asyncFuncCreator({
    constant: 'USER_SET_AVATAR',
    promise: (client) => client.request({ url: '/user/' + id + '/avatar', method: 'post', data })
  });
}
