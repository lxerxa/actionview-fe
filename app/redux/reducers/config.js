import * as t from '../constants/ActionTypes';

const initialState = { ecode: 0, data: {}, options: {}, loading: false };

export default function config(state = initialState, action) {
  switch (action.type) {
    case t.PROJECT_CONFIG:
      return { ...state, loading: true, data: {}, options: {} };

    case t.PROJECT_CONFIG_SUCCESS:
      if (action.result.ecode === 0) {
        state.data = action.result.data;
        state.options = action.result.options;
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.PROJECT_CONFIG_FAIL:
      return { ...state, loading: false, error: action.error };

    default:
      return state;
  }
}
