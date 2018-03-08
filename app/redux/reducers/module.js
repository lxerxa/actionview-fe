import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { ecode: 0, collection: [], options: {}, indexLoading: false, loading: false, itemLoading: false, selectedItem: {} };

export default function module(state = initialState, action) {
  switch (action.type) {
    case t.MODULE_INDEX:
      return { ...state, indexLoading: true, collection: [] };

    case t.MODULE_INDEX_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.collection = action.result.data;
        state.options = action.result.options;
      }
      return { ...state, indexLoading: false, ecode: action.result.ecode };

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

    case t.MODULE_UPDATE:
      return { ...state, loading: true };

    case t.MODULE_UPDATE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        state.collection[ind] = action.result.data;
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.MODULE_UPDATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.MODULE_SELECT:
      const el = _.find(state.collection, { id: action.id });
      return { ...state, itemLoading: false, selectedItem: el };

    case t.MODULE_DELETE:
      return { ...state, itemLoading: true };

    case t.MODULE_DELETE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.collection = _.reject(state.collection, { id: action.id });
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.MODULE_DELETE_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.MODULE_SET_SORT:
      return { ...state, loading: true };

    case t.MODULE_SET_SORT_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const newCollection = [];
        _.map(action.result.data, (v) => {
          const index = _.findIndex(state.collection, { id: v });
          if (index !== -1) {
            newCollection.push(state.collection[index]);
          }
        });
        state.collection = newCollection;
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.MODULE_SET_SORT_FAIL:
      return { ...state, loading: false, error: action.error };

    default:
      return state;
  }
}
