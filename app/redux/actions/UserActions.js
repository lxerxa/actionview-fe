import { asyncFuncCreator } from '../utils';

export function retrieve(email) {
  return asyncFuncCreator({
    constant: 'USER_PWD_RETRIEVE',
    promise: (client) => client.request({ url: '/user/pwd?email=' + email });
  });
}

export function register(values) {
  return asyncFuncCreator({
    constant: 'USER_REGISTER',
    promise: (client) => client.request({ url: '/user', method: 'post', data: values });
  });
}
