import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { 
  ecode: 0, 
  collection: [], 
  item: {}, 
  indexLoading: false, 
  loading: false, 
  itemLoading: false, 
  selectedItem: {},
  options: {} 
};

export default function labels(state = initialState, action) {
  switch (action.type) {
    case t.LABELS_INDEX:
      return { ...state, indexLoading: true, collection: [] };

    case t.LABELS_INDEX_SUCCESS:
      if (action.result.ecode === 0) {
        state.collection = action.result.data || {};
        state.options = action.result.options || {};
      }
      return { ...state, indexLoading: false, ecode: action.result.ecode };

    case t.LABELS_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    case t.LABELS_CREATE:
      return { ...state, loading: true };

    case t.LABELS_CREATE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.collection.unshift(action.result.data);
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.LABELS_CREATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.LABELS_UPDATE:
      return { ...state, loading: true };

    case t.LABELS_UPDATE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        _.extend(state.collection[ind], action.result.data);
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.LABELS_UPDATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.LABELS_SELECT:
      const el = _.find(state.collection, { id: action.id });
      return { ...state, itemLoading: false, selectedItem: el };

    case t.LABELS_DELETE:
      return { ...state, loading: true };

    case t.LABELS_DELETE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.collection = _.reject(state.collection, { id: action.id });
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        if (ind !== -1) {
          _.extend(state.collection[ind], action.result.data);
        }
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.LABELS_DELETE_FAIL:
      return { ...state, loading: false, error: action.error };

    default:
      return state;
  }
}
