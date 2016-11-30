import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { ecode: 0, collection: [], itemData: {}, options: {}, indexLoading: false, optionsLoading: false, searchLoading: false, searcherLoading: false, loading: false, itemLoading: false, fileLoading: false, selectedItem: {} };

export default function issue(state = initialState, action) {
  switch (action.type) {
    case t.ISSUE_INDEX:
      return { ...state, indexLoading: true, collection: [] };

    case t.ISSUE_INDEX_SUCCESS:
      _.assign(state.options, action.result.options || {});
      return { ...state, indexLoading: false, ecode: action.result.ecode, collection: action.result.data };

    case t.ISSUE_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    case t.ISSUE_OPTIONS:
      return { ...state, optionsLoading: true };

    case t.ISSUE_OPTIONS_SUCCESS:
      _.assign(state.options, action.result.data || {});
      return { ...state, optionsLoading: false, ecode: action.result.ecode };

    case t.ISSUE_OPTIONS_FAIL:
      return { ...state, optionsLoading: false, error: action.error };

    case t.ISSUE_CREATE:
      return { ...state, loading: true };

    case t.ISSUE_CREATE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.collection.unshift(action.result.data);
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.ISSUE_CREATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.ISSUE_EDIT:
      return { ...state, loading: true };

    case t.ISSUE_EDIT_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        state.collection[ind] = action.result.data;
        if (!_.isEmpty(state.itemData) && action.result.data.id === state.itemData.id) {
          state.itemData = action.result.data;
        }
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.ISSUE_EDIT_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.ISSUE_SHOW:
      return { ...state, itemLoading: true, itemData: {} };

    case t.ISSUE_SHOW_SUCCESS:
      return { ...state, itemLoading: false, ecode: action.result.ecode, itemData: action.result.data };

    case t.ISSUE_SHOW_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.ISSUE_DELETE_NOTIFY:
      const el = _.find(state.collection, { id: action.id });
      return { ...state, itemLoading: false, selectedItem: { id: el.id, name: el.name } };

    case t.ISSUE_DELETE:
      return { ...state, itemLoading: true };

    case t.ISSUE_DELETE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.collection = _.reject(state.collection, { id: action.id });
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.ISSUE_DELETE_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.ISSUE_SEARCHER_ADD:
      return { ...state, searcherLoading: true };

    case t.ISSUE_SEARCHER_ADD_SUCCESS:
      if ( action.result.ecode === 0 ) {
        if (!state.options.searchers) {
          state.options.searchers = [];
        }
        state.options.searchers.push(action.result.data);
      }
      return { ...state, searcherLoading: false, ecode: action.result.ecode };

    case t.ISSUE_SEARCHER_ADD_FAIL:
      return { ...state, searcherLoading: false, error: action.error };

    case t.ISSUE_SEARCHER_DELETE:
      return { ...state, searcherLoading: true };

    case t.ISSUE_SEARCHER_DELETE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.options.searchers = _.reject(state.options.searchers, { id: action.id });
      }
      return { ...state, searcherLoading: false, ecode: action.result.ecode };

    case t.ISSUE_SEARCHER_DELETE_FAIL:
      return { ...state, searcherLoading: false, error: action.error };

    case t.ISSUE_FILE_DELETE:
      return { ...state, fileLoading: true };

    case t.ISSUE_FILE_DELETE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.itemData[action.field_key] = _.reject(state.itemData[action.field_key] || [], { id: action.id });
      }
      return { ...state, fileLoading: false, ecode: action.result.ecode };

    case t.ISSUE_FILE_DELETE_FAIL:
      return { ...state, fileLoading: false, error: action.error };

    case t.ISSUE_FILE_ADD:
      if (!state.itemData[action.field_key]) {
        state.itemData[action.field_key] = [];
      }
      state.itemData[action.field_key].push(action.file);
      return { ...state, itemData: state.itemData };

    case t.ISSUE_SET_ASSIGNEE:
      return { ...state, itemLoading: true };

    case t.ISSUE_SET_ASSIGNEE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        state.collection[ind] = action.result.data;
        if (!_.isEmpty(state.itemData) && action.result.data.id === state.itemData.id) {
          state.itemData = action.result.data;
        }
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.ISSUE_SET_ASSIGNEE_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    default:
      return state;
  }
}
