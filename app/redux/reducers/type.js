import * as t from '../constants/ActionTypes';

const initialState = { ecode: 0, collection: [] };

export default function project(state = initialState, action) {
  switch (action.type) {
    case t.TYPE_INDEX:
      return { ...state, loading: true };

    case t.TYPE_INDEX_SUCCESS:
      return { ...state, loading: false, ecode: action.result.ecode, collection: action.result.data };

    case t.TYPE_INDEX_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.TYPE_CREATE:
      return { ...state, loading: true };

    case t.TYPE_CREATE_SUCCESS:
      state.collection.unshift(action.result.data);
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.TYPE_CREATE_FAIL:
      return { ...state, loading: false, error: action.error };

    default:
      return state;
  }
}
