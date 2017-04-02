import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { ecode: 0, collection: [], indexLoading: false, item: {}, loading: false, options: {}, recents: [], recentsLoading: false };

export default function project(state = initialState, action) {
  switch (action.type) {
    case t.PROJECT_INDEX:
      return { ...state, indexLoading: true };

    case t.PROJECT_INDEX_SUCCESS:
      return { ...state, indexLoading: false, ecode: action.result.ecode, collection: action.result.data, item: {} };

    case t.PROJECT_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    case t.PROJECT_RECENTS:
      return { ...state, recentsLoading: true };

    case t.PROJECT_RECENTS_SUCCESS:
      return { ...state, recentsLoading: false, ecode: action.result.ecode, recents: action.result.data };

    case t.PROJECT_RECENTS_FAIL:
      return { ...state, recentsLoading: false, error: action.error };

    case t.PROJECT_SHOW:
      return { ...state, loading: true };

    case t.PROJECT_SHOW_SUCCESS:
      const newRecents = _.reject(state.recents, { key: action.result.data.key });
      newRecents.unshift(action.result.data);
      return { ...state, loading: false, ecode: action.result.ecode, item: action.result.data, recents: newRecents, options: action.result.options };

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
