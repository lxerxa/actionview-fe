import * as t from '../constants/ActionTypes';

const initialState = { ecode: 0, collection: [], item: {}, options: {} };

export default function project(state = initialState, action) {
  switch (action.type) {
    case t.PROJECT_INDEX:
      return { ...state, loading: true };

    case t.PROJECT_INDEX_SUCCESS:
      return { ...state, loading: false, ecode: action.result.ecode, collection: action.result.data, item: {} };

    case t.PROJECT_INDEX_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.PROJECT_SHOW:
      return { ...state, loading: true };

    case t.PROJECT_SHOW_SUCCESS:
      return { ...state, loading: false, ecode: action.result.ecode, item: action.result.data, collection: [], options: action.result.options };

    case t.PROJECT_SHOW_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.PROJECT_CREATE:
      return { ...state, loading: true };

    case t.PROJECT_CREATE_SUCCESS:
      state.collection.unshift(action.result.data);
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.PROJECT_CREATE_FAIL:
      return { ...state, loading: false, error: action.error };

    default:
      return state;
  }
}
