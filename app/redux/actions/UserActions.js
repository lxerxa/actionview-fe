import { asyncFuncCreator } from '../utils';

export function loadUsers() {
  return asyncFuncCreator({
    CONSTANT: 'USERS_LOAD',
    promise: (client) => client.loadUsers()
  });
}
