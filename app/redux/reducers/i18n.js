import * as t from '../constants/ActionTypes';

const errMsg = require('../constants/i18n/zh-cn/ErrMsg');

const initialState = { errMsg };

export default function i18n(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
