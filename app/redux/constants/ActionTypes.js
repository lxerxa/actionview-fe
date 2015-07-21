import {generateAsyncConstants} from '../utils';

export default {
  ...generateAsyncConstants('ADD_TODO'),
  ...generateAsyncConstants('TODOS_LOAD')
};
