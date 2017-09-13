import { asyncFuncCreator } from '../utils';

export function getUser() {
  return asyncFuncCreator({
    constant: 'MYSETTING_USER_SHOW',
    promise: (client) => client.request({ url: '/mysetting' })
  });
}

export function updAccount(values) {
  return asyncFuncCreator({
    constant: 'MYSETTING_ACCOUNT_UPDATE',
    promise: (client) => client.request({ url: '/mysetting/account', method: 'post', data: values })
  });
}

export function resetPwd(values) {
  return asyncFuncCreator({
    constant: 'MYSETTING_PWD_RESET',
    promise: (client) => client.request({ url: '/mysetting/resetpwd', method: 'post', data: values })
  });
}

export function updNotify(values) {
  return asyncFuncCreator({
    constant: 'MYSETTING_NOTIFY_UPDATE',
    promise: (client) => client.request({ url: '/mysetting/notify', method: 'post', data: values })
  });
}

export function updFavorite(values) {
  return asyncFuncCreator({
    constant: 'MYSETTING_FAVORITE_UPDATE',
    promise: (client) => client.request({ url: '/mysetting/favorite', method: 'post', data: values })
  });
}

export function setAvatar(data) {
  return asyncFuncCreator({
    constant: 'MYSETTING_SET_AVATAR',
    promise: (client) => client.request({ url: '/mysetting/avatar', method: 'post', data })
  });
}
