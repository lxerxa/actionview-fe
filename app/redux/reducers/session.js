import * as t from '../constants/ActionTypes';

const initialState = { token: '', ecode: 0 };

export default function session(state = initialState, action) {
  switch (action.type) {
    case t.SESSION_CREATE:
      return { ...state, loading: true };

    case t.SESSION_CREATE_SUCCESS:
      return { ...state, loading: false, ecode: action.result.ecode, user: action.result.data };

    case t.SESSION_CREATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.SESSION_DESTROY:
      return { ...state, token: '' };

    default:
      return state;
  }
}
