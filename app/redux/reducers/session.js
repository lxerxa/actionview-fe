import * as t from '../constants/ActionTypes';

const initialState = { token: '', ecode: 0, invalid: false, user: {} };

export default function session(state = initialState, action) {
  switch (action.type) {
    case t.SESSION_CREATE:
      return { ...state, loading: true, invalid: false };

    case t.SESSION_CREATE_SUCCESS:
      return { ...state, loading: false, ecode: action.result.ecode, user: action.result.data };

    case t.SESSION_CREATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.SESSION_DESTROY:
      return { ...state, user: {} };

    case t.SESSION_INVALIDATE:
      return { ...state, user: {}, invalid: true };

    default:
      return state;
  }
}
