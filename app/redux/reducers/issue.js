import * as t from '../constants/ActionTypes';

const initialState = { ecode: 0, collection: [], item: {} };

export default function issue(state = initialState, action) {
  switch (action.type) {
    case t.ISSUE_INDEX:
      return { ...state, loading: true };

    case t.ISSUE_INDEX_SUCCESS:
      return { ...state, loading: false, ecode: action.result.ecode, collection: action.result.data };

    case t.ISSUE_INDEX_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.ISSUE_CREATE:
      return { ...state, loading: true };

    case t.ISSUE_CREATE_SUCCESS:
      state.collection.unshift(action.result.data);
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.ISSUE_CREATE_FAIL:
      return { ...state, loading: false, error: action.error };

    default:
      return state;
  }
}
