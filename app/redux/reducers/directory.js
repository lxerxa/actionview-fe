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
  selectedItem: {}, 
  testLoading: false, 
  testInfo: {}, 
  syncLoading: false, 
  syncInfo: {} 
};

export default function directory(state = initialState, action) {
  switch (action.type) {

    case t.DIRECTORY_INDEX:
      return { ...state, indexLoading: true, loading: false, itemLoading: false, testLoading: false, syncLoading: false, collection: [] };

    case t.DIRECTORY_INDEX_SUCCESS:
      if (action.result.ecode === 0) {
        _.assign(state.options, action.result.options || {});
        state.collection = action.result.data;
      }
      return { ...state, indexLoading: false, ecode: action.result.ecode };

    case t.DIRECTORY_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    case t.DIRECTORY_CREATE:
      return { ...state, loading: true };

    case t.DIRECTORY_CREATE_SUCCESS:
      if (action.result.ecode === 0) {
        state.collection.unshift(action.result.data);
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.DIRECTORY_CREATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.DIRECTORY_UPDATE:
      return { ...state, loading: true };

    case t.DIRECTORY_UPDATE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        state.collection[ind] = action.result.data;
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.DIRECTORY_UPDATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.DIRECTORY_INVALIDATE:
      return { ...state, itemLoading: true };

    case t.DIRECTORY_INVALIDATE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        state.collection[ind] = action.result.data;
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.DIRECTORY_INVALIDATE_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.DIRECTORY_DELETE:
      return { ...state, itemLoading: true };

    case t.DIRECTORY_DELETE_SUCCESS:
      if (action.result.ecode === 0) {
        state.collection = _.reject(state.collection, { id: action.id });
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.DIRECTORY_DELETE_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.DIRECTORY_SELECT:
      const el = _.find(state.collection, { id: action.id });
      return { ...state, selectedItem: el };

    case t.DIRECTORY_TEST:
      return { ...state, testInfo: {}, testLoading: true };

    case t.DIRECTORY_TEST_SUCCESS:
      return { ...state, testLoading: false, testInfo: action.result.data, ecode: action.result.ecode };

    case t.DIRECTORY_TEST_FAIL:
      return { ...state, testLoading: false, error: action.error };

    case t.DIRECTORY_SYNC:
      return { ...state, syncInfo: {}, syncLoading: true };

    case t.DIRECTORY_SYNC_SUCCESS:
      return { ...state, syncLoading: false, syncInfo: action.result.data, ecode: action.result.ecode };

    case t.DIRECTORY_SYNC_FAIL:
      return { ...state, syncLoading: false, error: action.error };

    default:
      return state;
  }
}
