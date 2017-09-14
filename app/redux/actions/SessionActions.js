import { push } from 'react-router-redux';
import { asyncFuncCreator } from '../utils';
import { SESSION_INVALIDATE } from '../constants/ActionTypes';

export function create(values) {
  return asyncFuncCreator({
    constant: 'SESSION_CREATE',
    promise: (client) => client.request({ url: '/session', method: 'post', data: values })
  });
}

export function destroy() {
  return asyncFuncCreator({
    constant: 'SESSION_DESTROY',
    promise: (client) => client.request({ url: '/session', method: 'delete' })
  });
}

export function getSess() {
  return asyncFuncCreator({
    constant: 'SESSION_GET',
    promise: (client) => client.request({ url: '/session', method: 'get' })
  });
}

export function invalidate() {
  return { type: 'SESSION_INVALIDATE' };
}

export function updAvatar(avatar) {
  return { type: 'SESSION_UPD_AVATAR', avatar };
}
