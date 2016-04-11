import * as t from '../constants/ActionTypes';

const initialState = { token: '', cnt: 0 };

export default function session(state = initialState, action) {
  switch (action.type) {
    case t.SESSION_CREATE:
      return { ...state, loading: true };

    case t.SESSION_CREATE_SUCCESS:
      return { ...state, loading: false, cnt: state.cnt + 1, ...action.result };

    case t.SESSION_CREATE_FAIL:
      return { ...state, loading: false, error: action.error, cnt: state.cnt + 1 };

    default:
      return state;
  }
}
