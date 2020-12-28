import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { 
  ecode: 0, 
  collection: [], 
  indexLoading: false, 
  increaseCollection: [], 
  moreLoading: false, 
  statsLoading: false,
  itemLoading: false, 
  item: {}, 
  loading: false, 
  options: {}, 
  recents: [], 
  recentsLoading: false, 
  selectedItem: {} 
};

export default function project(state = initialState, action) {
  switch (action.type) {
    case t.PROJECT_INDEX:
      return { ...state, indexLoading: true, moreLoading: false, loading: false, itemLoading: false, collection: [], increaseCollection: [] };

    case t.PROJECT_INDEX_SUCCESS:
      if (action.result.ecode === 0) {
        _.assign(state.options, action.result.options || {});
        state.collection = action.result.data;
        state.increaseCollection = action.result.data;
      }
      return { ...state, indexLoading: false, ecode: action.result.ecode };

    case t.PROJECT_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    case t.PROJECT_MORE:
      return { ...state, moreLoading: true };

    case t.PROJECT_MORE_SUCCESS:
      if (action.result.ecode === 0) {
        state.collection = state.collection.concat(action.result.data);
        state.increaseCollection = action.result.data;
      }
      return { ...state, moreLoading: false, ecode: action.result.ecode };

    case t.PROJECT_MORE_FAIL:
      return { ...state, moreLoading: false, error: action.error };

    case t.PROJECT_STATS:
      return { ...state, statsLoading: true };

    case t.PROJECT_STATS_SUCCESS:
      if (action.result.ecode === 0) {
        _.forEach(action.result.data, (v) => {
          const i = _.findIndex(state.collection, { key: v.key });
          if (i !== -1) {
            state.collection[i].stats = v.stats;
          }
        });
      }
      return { ...state, statsLoading: false, ecode: action.result.ecode };

    case t.PROJECT_STATS_FAIL:
      return { ...state, statsLoading: false, error: action.error };

    case t.PROJECT_OPTIONS:
      return { ...state, loading: true };

    case t.PROJECT_OPTIONS_SUCCESS:
      if (action.result.ecode === 0) {
        _.assign(state.options, action.result.data || {});
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.PROJECT_OPTIONS_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.PROJECT_RECENTS:
      return { ...state, recentsLoading: true };

    case t.PROJECT_RECENTS_SUCCESS:
      if (action.result.ecode === 0) {
        state.recents = action.result.data;
      }
      return { ...state, recentsLoading: false, ecode: action.result.ecode };

    case t.PROJECT_RECENTS_FAIL:
      return { ...state, recentsLoading: false, error: action.error };

    case t.PROJECT_CREATE:
      return { ...state, loading: true };

    case t.PROJECT_CREATE_SUCCESS:
      if ( action.result.ecode === 0 ) { 
        state.collection.unshift(action.result.data);
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.PROJECT_CREATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.PROJECT_SHOW:
      return { ...state, ecode: 0, loading: true, item:{}, options: {} };

    case t.PROJECT_SHOW_SUCCESS:
      if (action.result.ecode === 0) {
        state.item = action.result.data;
        state.options = action.result.options;

        const curInd = _.findIndex(state.recents, { key: action.result.data.key }); 
        if (curInd === -1) {
          state.recents.unshift(action.result.data);
        }   
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.PROJECT_SHOW_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.PROJECT_UPDATE:
      return { ...state, loading: true };
    case t.PROJECT_ARCHIVE:
    case t.PROJECT_DELETE:
    case t.PROJECT_REOPEN:
    case t.PROJECT_CREATEINDEX:
      return { ...state, itemLoading: true };

    case t.PROJECT_ARCHIVE_SUCCESS:
    case t.PROJECT_REOPEN_SUCCESS:
    case t.PROJECT_UPDATE_SUCCESS:
    case t.PROJECT_CREATEINDEX_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        _.assign(state.collection[ind], action.result.data);
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.PROJECT_DELETE_SUCCESS:
      if (action.result.ecode === 0) {
        state.collection = _.reject(state.collection, { id: action.id });
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.PROJECT_ARCHIVE_FAIL:
    case t.PROJECT_DELETE_FAIL:
    case t.PROJECT_REOPEN_FAIL:
    case t.PROJECT_UPDATE_FAIL:
    case t.PROJECT_CRAETEINDEX_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.PROJECT_MULTI_ARCHIVE:
    case t.PROJECT_MULTI_REOPEN:
    case t.PROJECT_MULTI_CREATEINDEX:
      return { ...state, loading: false };

    case t.PROJECT_MULTI_ARCHIVE_SUCCESS:
      if (action.result.ecode === 0) {
        _.map(state.collection, (v, i) => {
          if (action.ids.indexOf(v.id) !== -1) {
            state.collection[i].status = 'archived';
          }
        });
      }
      return { ...state, loading: true, ecode: action.result.ecode };
    case t.PROJECT_MULTI_REOPEN_SUCCESS:
      if (action.result.ecode === 0) {
        _.map(state.collection, (v, i) => {
          if (action.ids.indexOf(v.id) !== -1) {
            state.collection[i].status = 'active';
          }
        });
      }
      return { ...state, loading: true, ecode: action.result.ecode };
    case t.PROJECT_MULTI_CREATEINDEX_SUCCESS:
      return { ...state, loading: false };

    case t.PROJECT_MULTI_ARCHIVE_FAIL:
    case t.PROJECT_MULTI_REOPEN_FAIL:
    case t.PROJECT_MULTI_CREATEINDEX_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.PROJECT_SELECT:
      const el = _.find(state.collection, { id: action.id });
      return { ...state, selectedItem: el };

    case t.PROJECT_CLEAN_SELECTED:
      return { ...state, item: {} };

    default:
      return state;
  }
}
