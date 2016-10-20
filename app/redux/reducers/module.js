import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { ecode: 0, collection: [], item: {}, options: {}, indexLoading: false, loading: false, itemLoading: false, selectedItem: {} };

export default function module(state = initialState, action) {
  switch (action.type) {
    case t.MODULE_INDEX:
      return { ...state, indexLoading: true, collection: [] };

    case t.MODULE_INDEX_SUCCESS:
      return { ...state, indexLoading: false, ecode: action.result.ecode, collection: action.result.data, options: action.result.options };

    case t.MODULE_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    case t.MODULE_CREATE:
      return { ...state, loading: true };

    case t.MODULE_CREATE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.collection.push(action.result.data);
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.MODULE_CREATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.MODULE_EDIT:
      return { ...state, loading: true };

    case t.MODULE_EDIT_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        state.collection[ind] = action.result.data;
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.MODULE_EDIT_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.MODULE_SHOW:
      const el = _.find(state.collection, { id: action.id });
      return { ...state, itemLoading: false, selectedItem: el };

    case t.MODULE_DELETE_NOTIFY:
      const el2 = _.find(state.collection, { id: action.id });
      return { ...state, itemLoading: false, selectedItem: { id: el2.id, name: el2.name } };

    case t.MODULE_DELETE:
      return { ...state, itemLoading: true };

    case t.MODULE_DELETE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.collection = _.reject(state.collection, { id: action.id });
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.MODULE_DELETE_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    default:
      return state;
  }
}
