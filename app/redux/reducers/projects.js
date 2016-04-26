import * as t from '../constants/ActionTypes';

const initialState = { ecode: 0 };

export default function projects(state = initialState, action) {
  switch (action.type) {
    case t.PROJECTS_INDEX:
      return { ...state, loading: true };

    case t.PROJECTS_INDEX_SUCCESS:
      return { ...state, loading: false, ecode: action.result.ecode, collection: action.result.data };

    case t.PROJECTS_INDEX_FAIL:
      return { ...state, loading: false, error: action.error };

    default:
      return state;
  }
}
