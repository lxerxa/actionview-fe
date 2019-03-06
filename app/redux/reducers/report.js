import * as t from '../constants/ActionTypes';

const initialState = { ecode: 0, data: {}, options: {}, loading: false };

export default function report(state = initialState, action) {
  switch (action.type) {
    case t.REPORT_LIST:
      return { ...state, loading: true, data: {}, options: {} };

    case t.REPORT_LIST_SUCCESS:
      if (action.result.ecode === 0) {
        state.data = action.result.data;
        state.options = action.result.options;
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.REPORT_LIST_FAIL:
      return { ...state, loading: false, error: action.error };

    default:
      return state;
  }
}
