import { generateAsyncConstants } from '../utils';

export default {
  ...generateAsyncConstants('TODO_ADD'),
  ...generateAsyncConstants('TODOS_LOAD'),
  ...generateAsyncConstants('USERS_LOAD')
};
