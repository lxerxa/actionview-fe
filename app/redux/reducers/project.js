import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { ecode: 0, collection: [], indexLoading: false, itemLoading: false, item: {}, loading: false, options: {}, recents: [], recentsLoading: false, selectedItem: {} };

export default function project(state = initialState, action) {
  switch (action.type) {
    case t.PROJECT_INDEX:
      return { ...state, indexLoading: true };

    case t.PROJECT_INDEX_SUCCESS:
      _.assign(state.options, action.result.options || {});
      return { ...state, indexLoading: false, ecode: action.result.ecode, collection: action.result.data, item: {} };

    case t.PROJECT_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    case t.PROJECT_RECENTS:
      return { ...state, recentsLoading: true };

    case t.PROJECT_RECENTS_SUCCESS:
      return { ...state, recentsLoading: false, ecode: action.result.ecode, recents: action.result.data };

    case t.PROJECT_RECENTS_FAIL:
      return { ...state, recentsLoading: false, error: action.error };

    case t.PROJECT_CREATE:
      return { ...state, loading: true };

    case t.PROJECT_CREATE_SUCCESS:
      state.collection.unshift(action.result.data);
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.PROJECT_CREATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.PROJECT_SHOW:
      const el = _.find(state.collection, { id: action.id });
      return { ...state, itemLoading: false, selectedItem: el };

    case t.PROJECT_EDIT:
      return { ...state, loading: true };
    case t.PROJECT_CLOSE:
    case t.PROJECT_REOPEN:
      return { ...state, itemLoading: true };

    case t.PROJECT_CLOSE_SUCCESS:
    case t.PROJECT_REOPEN_SUCCESS:
    case t.PROJECT_EDIT_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        state.collection[ind] = action.result.data;
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.PROJECT_CLOSE_FAIL:
    case t.PROJECT_REOPEN_FAIL:
    case t.PROJECT_EDIT_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    default:
      return state;
  }
}
