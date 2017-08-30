import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { ecode: 0, collection: [], indexLoading: false, itemLoading: false, item: {}, loading: false, options: {}, selectedItem: {} };

export default function project(state = initialState, action) {
  switch (action.type) {

    case t.GROUP_INDEX:
      return { ...state, indexLoading: true, collection: [] };

    case t.GROUP_INDEX_SUCCESS:
      if (action.result.ecode === 0) {
        _.assign(state.options, action.result.options || {});
        state.collection = action.result.data;
      }
      return { ...state, indexLoading: false, ecode: action.result.ecode };

    case t.GROUP_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    case t.GROUP_CREATE:
      return { ...state, loading: true };

    case t.GROUP_CREATE_SUCCESS:
      if (action.result.ecode === 0) {
        state.collection.unshift(action.result.data);
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.GROUP_CREATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.GROUP_UPDATE:
      return { ...state, loading: true };

    case t.GROUP_UPDATE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        state.collection[ind] = action.result.data;
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.GROUP_UPDATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.GROUP_DELETE:
      return { ...state, itemLoading: true };

    case t.GROUP_DELETE_SUCCESS:
      if (action.result.ecode === 0) {
        state.collection = _.reject(state.collection, { id: action.id });
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.GROUP_DELETE_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.GROUP_MULTI_DELETE:
      return { ...state, loading: false };

    case t.GROUP_MULTI_DELETE_SUCCESS:
      if (action.result.ecode === 0) {
        state.collection = _.reject(state.collection, (v) => { return action.ids.indexOf(v.id) !== -1 });
      }
      return { ...state, loading: true, ecode: action.result.ecode };

    case t.GROUP_MULTI_DELETE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.GROUP_SELECT:
      const el = _.find(state.collection, { id: action.id });
      return { ...state, selectedItem: el };

    default:
      return state;
  }
}
