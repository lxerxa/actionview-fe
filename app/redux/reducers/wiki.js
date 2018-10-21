import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { ecode: 0, collection: [], indexLoading: false, itemLoading: false, item: {}, loading: false, options: {}, selectedItem: {} };

export default function wiki(state = initialState, action) {
  switch (action.type) {
    case t.WIKI_INDEX:
      return { ...state, indexLoading: true, collection: [], increaseCollection: [] };

    case t.WIKI_INDEX_SUCCESS:
      if (action.result.ecode === 0) {
        state.collection = action.result.data;
        state.options = _.extend(state.options, action.result.options);
      }
      return { ...state, indexLoading: false, item: {}, ecode: action.result.ecode };

    case t.WIKI_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    case t.WIKI_SHOW:
      return { ...state, itemLoading: true, item: action.fid != state.item.id || action.v ? {} : state.item, options: action.fid != state.item.id ? {} : state.options };

    case t.WIKI_SHOW_SUCCESS:
      if (action.result.ecode === 0) {
        state.item = action.result.data;
        state.options = action.result.options;
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.WIKI_SHOW_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.WIKI_CREATE:
      return { ...state, loading: true };

    case t.WIKI_CREATE_SUCCESS:
      if ( action.result.ecode === 0 ) { 
        state.collection.unshift(action.result.data);
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.WIKI_CREATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.WIKI_UPDATE:
      return { ...state, loading: true };

    case t.WIKI_UPDATE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        if (ind !== -1) {
          state.collection[ind] = action.result.data;
        }
        state.item = action.result.data;
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.WIKI_UPDATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.WIKI_DELETE:
      return { ...state, itemLoading: true };

    case t.WIKI_DELETE_SUCCESS:
      if (action.result.ecode === 0) {
        state.collection = _.reject(state.collection, { id: action.id });
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.WIKI_DELETE_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.WIKI_CHECK_IN:
    case t.WIKI_CHECK_OUT:
      return { ...state, itemLoading: true };

    case t.WIKI_CHECK_IN_SUCCESS:
    case t.WIKI_CHECK_OUT_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        if (ind !== -1) {
          state.collection[ind] = action.result.data;
        }
        state.item = action.result.data;
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.WIKI_CHECK_IN_FAIL:
    case t.WIKI_CHECK_OUT_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.WIKI_SELECT:
      const el = _.find(state.collection, { id: action.id });
      return { ...state, selectedItem: el };

    case t.WIKI_ADD:
      state.collection.push(action.file);
      return { ...state };

    default:
      return state;
  }
}
