import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { ecode: 0, collection: [], options: {}, indexLoading: false, loading: false, itemLoading: false, selectedItem: {} };

export default function resolution(state = initialState, action) {
  switch (action.type) {
    case t.EVENTS_INDEX:
      return { ...state, indexLoading: true, collection: [] };

    case t.EVENTS_INDEX_SUCCESS:
      return { ...state, indexLoading: false, ecode: action.result.ecode, collection: action.result.data, options: action.result.options };

    case t.EVENTS_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    case t.EVENTS_CREATE:
      return { ...state, loading: true };

    case t.EVENTS_CREATE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.collection.push(action.result.data);
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.EVENTS_CREATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.EVENTS_EDIT:
      return { ...state, loading: true };

    case t.EVENTS_EDIT_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        state.collection[ind] = action.result.data;
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.EVENTS_EDIT_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.EVENTS_SHOW:
      const el = _.find(state.collection, { id: action.id });
      return { ...state, itemLoading: false, selectedItem: el };

    case t.EVENTS_RESET:
      return { ...state, itemLoading: true };

    case t.EVENTS_RESET_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.id });
        state.collection[ind] = action.result.data;
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.EVENTS_RESET_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.EVENTS_DELETE:
      return { ...state, itemLoading: true };

    case t.EVENTS_DELETE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.collection = _.reject(state.collection, { id: action.id });
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.EVENTS_DELETE_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    default:
      return state;
  }
}
