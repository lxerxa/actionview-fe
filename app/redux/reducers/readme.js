import * as t from '../constants/ActionTypes';

const initialState = { markdown: '' };

export default function readme(state = initialState, action) {
  switch (action.type) {
    case t.README_LOAD:
      return { ...state, loading: true };

    case t.README_LOAD_SUCCESS:
      return { ...state, loading: false, markdown: action.result };

    case t.README_LOAD_FAIL:
      return { ...state, loading: false, error: action.error };

    default:
      return state;
  }
}
