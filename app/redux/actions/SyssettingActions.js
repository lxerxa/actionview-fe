import { asyncFuncCreator } from '../utils';

export function show() {
  return asyncFuncCreator({
    constant: 'SYSSETTING_SHOW',
    promise: (client) => client.request({ url: '/syssetting' })
  });
}

export function update(values) {
  return asyncFuncCreator({
    constant: 'SYSSETTING_UPDATE',
    promise: (client) => client.request({ url: '/syssetting', method: 'post', data: values })
  });
}

export function resetPwd(values) {
  return asyncFuncCreator({
    constant: 'SYSSETTING_RESET_PWD',
    promise: (client) => client.request({ url: '/syssetting/resetpwd', method: 'post', data: values })
  });
}

export function sendTestMail(values) {
  return asyncFuncCreator({
    constant: 'SYSSETTING_SEND_TESTMAIL',
    promise: (client) => client.request({ url: '/syssetting/sendtestmail', method: 'post', data: values })
  });
}
