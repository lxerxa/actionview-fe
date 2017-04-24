import { asyncFuncCreator } from '../utils';

export function getUser() {
  return asyncFuncCreator({
    constant: 'MYSETTING_USER_SHOW',
    promise: (client) => client.request({ url: '/mysetting' })
  });
}

export function updAccount() {
  return asyncFuncCreator({
    constant: 'MYSETTING_ACCOUNT_UPDATE',
    promise: (client) => client.request({ url: '/mysetting/account', method: 'post' })
  });
}

export function updNotify() {
  return asyncFuncCreator({
    constant: 'MYSETTING_NOTIFY_UPDATE',
    promise: (client) => client.request({ url: '/mysetting/notify', method: 'post' })
  });
}

export function updFavorite() {
  return asyncFuncCreator({
    constant: 'MYSETTING_FAVORITE_UPDATE',
    promise: (client) => client.request({ url: '/mysetting/favorite', method: 'post' })
  });
}
