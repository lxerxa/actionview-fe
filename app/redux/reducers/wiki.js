import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { 
  ecode: 0, 
  collection: [], 
  indexLoading: false, 
  itemLoading: false, 
  item: {}, 
  loading: false, 
  options: {}, 
  selectedItem: {} 
};

function sort(collection, sortkey='') {
  if (!sortkey) {
    sortkey = window.localStorage && window.localStorage.getItem('wiki-sortkey') || 'create_time_desc';
  }

  collection.sort(function(a, b) {
    if (a.d == b.d || (!a.d && !b.d)) {
      if (sortkey == 'create_time_desc') {
        return b.created_at - a.created_at;
      } else if (sortkey == 'create_time_asc') {
        return a.created_at - b.created_at;
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

export default function wiki(state = initialState, action) {
  switch (action.type) {
    case t.WIKI_INDEX:
      return { ...state, indexLoading: true, collection: [], item: {} };

    case t.WIKI_INDEX_SUCCESS:
      if (action.result.ecode === 0) {
        state.collection = action.result.data;
        _.extend(state.options, action.result.options);
      }
      return { ...state, indexLoading: false, ecode: action.result.ecode };

    case t.WIKI_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    case t.WIKI_SHOW:
      return { ...state, itemLoading: true, item: action.wid != state.item.id || action.v ? {} : state.item };

    case t.WIKI_SHOW_SUCCESS:
      if (action.result.ecode === 0) {
        state.item = action.result.data;
        _.extend(state.options, action.result.options);
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.WIKI_SHOW_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.WIKI_CREATE:
      return { ...state, loading: true };

    case t.WIKI_CREATE_SUCCESS:
      if ( action.result.ecode === 0 ) { 
        state.collection.unshift(action.result.data);
        if (action.result.data.d !== 1 && action.result.data.name.toLowerCase() === 'home' && (!state.options.home || !state.options.home.id)) {
          state.options.home = action.result.data;
        }
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

        if (action.result.data.d === 1) {
          return { ...state, loading: false, ecode: action.result.ecode };
        }

        if (state.options.home && state.options.home.id) {
          if (state.options.home.id === action.result.data.id) {
            if (action.result.data.name.toLowerCase() === 'home') {
              state.options.home = action.result.data;
            } else {
              state.options.home = {};
            }
          }
        } else if (action.result.data.name.toLowerCase() === 'home') {
          state.options.home = action.result.data;
        }
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.WIKI_UPDATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.WIKI_DELETE:
      return { ...state, itemLoading: true };

    case t.WIKI_DELETE_SUCCESS:
      if (action.result.ecode === 0) {
        state.collection = _.reject(state.collection, { id: action.id });
        if (state.options.home && state.options.home.id === action.id) {
          state.options.home = {};
        }
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
        if (state.options.home && state.options.home.id === action.result.data.id) {
          state.options.home = action.result.data;
        }
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.WIKI_CHECK_IN_FAIL:
    case t.WIKI_CHECK_OUT_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.WIKI_COPY:
    case t.WIKI_MOVE:
      return { ...state, loading: true };

    case t.WIKI_COPY_SUCCESS:
      if ( action.result.ecode === 0 && action.toCurPath ) {
        state.collection.push(action.result.data);
        if (action.result.data.name.toLowerCase() === 'home' && (!state.options.home || !state.options.home.id)) {
          state.options.home = action.result.data;
        }
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.WIKI_MOVE_SUCCESS:
      if (action.result.ecode === 0) {
        state.collection = _.reject(state.collection, { id: action.result.data.id });
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.WIKI_COPY_FAIL:
    case t.WIKI_MOVE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.WIKI_SELECT:
      const el = _.find(state.collection, { id: action.id });
      return { ...state, selectedItem: el };

    case t.WIKI_ATTACHMENT_ADD:
      if (!state.item.attachments) {
        state.item.attachments = [];
      }
      state.item.attachments.push(action.file);
      return { ...state, item: state.item };

    case t.WIKI_ATTACHMENT_DELETE:
      return { ...state, loading: true };

    case t.WIKI_ATTACHMENT_DELETE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.item.attachments = _.reject(state.item.attachments || [], { id: action.id });
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.WIKI_ATTACHMENT_DELETE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.WIKI_SORT:
      sort(state.collection, action.key);
      return { ...state };

    default:
      return state;
  }
}
