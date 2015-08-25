import { generateAsyncConstants } from '../utils';

export default {
  USERS_CLEAR_ERROR: 'USERS_CLEAR_ERROR',
  ...generateAsyncConstants('USERS_INDEX'),
  ...generateAsyncConstants('USERS_SHOW'),
  ...generateAsyncConstants('README_LOAD'),
  LOCALE_INITIALIZE: 'LOCALE_INITIALIZE',
  ...generateAsyncConstants('LOCALE_CHANGE')
};
