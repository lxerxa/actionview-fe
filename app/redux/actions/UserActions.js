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
