import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { ecode: 0, collection: [], item: {}, options: {}, indexLoading: false, loading: false, itemLoading: false, selectedItem: {} };

export default function field(state = initialState, action) {
  switch (action.type) {
    case t.FIELD_INDEX:
      return { ...state, indexLoading: true, collection: [] };

    case t.FIELD_INDEX_SUCCESS:
      return { ...state, indexLoading: false, ecode: action.result.ecode, collection: action.result.data, options: action.result.options };

    case t.FIELD_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    case t.FIELD_CREATE:
      return { ...state, loading: true };

    case t.FIELD_CREATE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.collection.push(action.result.data);
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.FIELD_CREATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.FIELD_EDIT:
      return { ...state, loading: true };

    case t.FIELD_EDIT_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        state.collection[ind] = _.assign(state.collection[ind], action.result.data);
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.FIELD_EDIT_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.FIELD_SHOW:
      return { ...state, itemLoading: true, selectedItem: { id: action.id } };

    case t.FIELD_SHOW_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.item = action.result.data;
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.FIELD_SHOW_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.FIELD_DELETE_NOTIFY:
      const el = _.find(state.collection, { id: action.id });
      return { ...state, itemLoading: false, selectedItem: { id: el.id, name: el.name } };

    case t.FIELD_DELETE:
      return { ...state, itemLoading: true };

    case t.FIELD_DELETE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.collection = _.reject(state.collection, { id: action.id });
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.FIELD_DELETE_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    default:
      return state;
  }
}
