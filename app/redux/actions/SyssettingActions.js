import { asyncFuncCreator } from '../utils';

export function show() {
  return asyncFuncCreator({
    constant: 'SYSSETTING_SHOW',
    promise: (client) => client.request({ url: '/admin/syssetting' })
  });
}

export function update(values) {
  return asyncFuncCreator({
    constant: 'SYSSETTING_UPDATE',
    promise: (client) => client.request({ url: '/admin/syssetting', method: 'post', data: values })
  });
}
