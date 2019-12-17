import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { 
  ecode: 0, 
  collection: [], 
  optionsLoading: false, 
  indexLoading: false, 
  itemLoading: false, 
  item: {}, 
  loading: false, 
  options: {}, 
  selectedItem: {} 
};

function sort(collection, sortkey='') {
  if (!sortkey) {
    sortkey = window.localStorage && window.localStorage.getItem('document-sortkey') || 'create_time_desc';
  }

  collection.sort(function(a, b) { 
    if (a.d == b.d || (!a.d && !b.d)) {
      if (sortkey == 'create_time_desc') {
        return (b.created_at || b.uploaded_at) - (a.created_at || a.uploaded_at);
      } else if (sortkey == 'create_time_asc') {
        return (a.created_at || a.uploaded_at) - (b.created_at || b.uploaded_at);
      } else if (sortkey == 'name_asc') {
        return a.name.localeCompare(b.name);
      } else if (sortkey == 'name_desc') {
        return -a.name.localeCompare(b.name);
      }
    } else {
      return (b.d || 0) - (a.d || 0);
    }
  });
}

export default function document(state = initialState, action) {
  switch (action.type) {
    case t.DOCUMENT_INDEX:
      return { ...state, indexLoading: true, collection: [], increaseCollection: [] };

    case t.DOCUMENT_INDEX_SUCCESS:
      if (action.result.ecode === 0) {
        state.collection = action.result.data;
        sort(state.collection);
        _.extend(state.options, action.result.options);
      }
      return { ...state, indexLoading: false, ecode: action.result.ecode };

    case t.DOCUMENT_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    case t.DOCUMENT_OPTIONS:
      return { ...state, optionsLoading: true, options: {} };

    case t.DOCUMENT_OPTIONS_SUCCESS:
      if (action.result.ecode === 0) {
        _.extend(state.options, action.result.data);
      }
      return { ...state, optionsLoading: false, ecode: action.result.ecode };

    case t.DOCUMENT_OPTIONS_FAIL:
      return { ...state, optionsLoading: false, error: action.error };

    case t.DOCUMENT_CREATE_FOLDER:
      return { ...state, itemLoading: true };

    case t.DOCUMENT_CREATE_FOLDER_SUCCESS:
      if ( action.result.ecode === 0 ) { 
        state.collection.unshift(action.result.data);
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.DOCUMENT_CREATE_FOLDER_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.DOCUMENT_UPDATE:
    case t.DOCUMENT_DELETE:
      return { ...state, itemLoading: true };

    case t.DOCUMENT_UPDATE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        state.collection[ind] = action.result.data;
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.DOCUMENT_DELETE_SUCCESS:
      if (action.result.ecode === 0) {
        state.collection = _.reject(state.collection, { id: action.id });
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.DOCUMENT_DELETE_FAIL:
    case t.DOCUMENT_UPDATE_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.DOCUMENT_COPY:
    case t.DOCUMENT_MOVE:
      return { ...state, loading: true };

    case t.DOCUMENT_COPY_SUCCESS:
      if ( action.result.ecode === 0 && action.isSamePath ) {
        state.collection.push(action.result.data);
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.DOCUMENT_MOVE_SUCCESS:
      if (action.result.ecode === 0) {
        state.collection = _.reject(state.collection, { id: action.result.data.id });
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.DOCUMENT_COPY_FAIL:
    case t.DOCUMENT_MOVE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.DOCUMENT_SELECT:
      const el = _.find(state.collection, { id: action.id });
      return { ...state, selectedItem: el };

    case t.DOCUMENT_ADD:
      state.collection.push(action.file);
      return { ...state };

    case t.DOCUMENT_SORT:
      sort(state.collection, action.key);
      return { ...state };

    default:
      return state;
  }

}
