import { USERS_CLEAR_ERROR } from '../constants/ActionTypes';
import { asyncFuncCreator } from '../utils';

export function index() {
  return asyncFuncCreator({
    constant: 'USERS_INDEX',
    promise: (client) => client.request({ url: '/users' })
  });
}

export function show(seed) {
  return asyncFuncCreator({
    constant: 'USERS_SHOW',
    promise: (client) => client.request({ url: '/users/' + seed })
  });
}

export function clearError() {
  return { type: USERS_CLEAR_ERROR };
}
