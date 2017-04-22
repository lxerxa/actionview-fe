import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { ecode: 0, collection: [], indexLoading: false, loading: false, itemLoading: false, selectedItem: {} };

export default function state(state = initialState, action) {
  switch (action.type) {
    case t.SCHEME_INDEX:
      return { ...state, indexLoading: true, collection: [] };

    case t.SCHEME_INDEX_SUCCESS:
      return { ...state, indexLoading: false, ecode: action.result.ecode, collection: action.result.data };

    case t.SCHEME_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    case t.SCHEME_CREATE:
      return { ...state, loading: true };

    case t.SCHEME_CREATE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.collection.push(action.result.data);
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.SCHEME_CREATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.SCHEME_UPDATE:
      return { ...state, loading: true };

    case t.SCHEME_UPDATE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        state.collection[ind] = action.result.data;
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.SCHEME_UPDATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.SCHEME_SELECT:
      const el = _.find(state.collection, { id: action.id });
      return { ...state, itemLoading: false, selectedItem: { id: el.id, name: el.name, description: el.description } };

    case t.SCHEME_DELETE:
      return { ...state, itemLoading: true };

    case t.SCHEME_DELETE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.collection = _.reject(state.collection, { id: action.id });
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.SCHEME_DELETE_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    default:
      return state;
  }
}
