import * as t from '../constants/ActionTypes';

const initialState = { };

export default function user(state = initialState, action) {
  switch (action.type) {
    case t.USER_INFO_FETCH:
      return { ...state, loading: true };

    case t.USER_INFO_FETCH_SUCCESS:
      return { ...state, loading: false, { ...action.result } };

    case t.USER_INFO_FETCH_FAIL:
      return { ...state, loading: false, error: action.error };

    default:
      return state;
  }
}
