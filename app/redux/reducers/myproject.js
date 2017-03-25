import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { ecode: 0, collection: [], increaseCollection: [], indexLoading: false, loading: false, moreLoading: false, itemLoading: false, selectedItem: {} };

export default function myproject(state = initialState, action) {
  switch (action.type) {
    case t.MYPROJECT_INDEX:
      return { ...state, indexLoading: true, collection: [], increaseCollection: [] };

    case t.MYPROJECT_INDEX_SUCCESS:
      return { ...state, indexLoading: false, ecode: action.result.ecode, collection: action.result.data, increaseCollection: action.result.data };

    case t.MYPROJECT_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    case t.MYPROJECT_MORE:
      return { ...state, moreLoading: true };

    case t.MYPROJECT_MORE_SUCCESS:
      return { ...state, moreLoading: false, ecode: action.result.ecode, collection: state.collection.concat(action.result.data), increaseCollection: action.result.data };

    case t.MYPROJECT_MORE_FAIL:
      return { ...state, moreLoading: false, error: action.error };

    case t.MYPROJECT_CREATE:
      return { ...state, loading: true };

    case t.MYPROJECT_CREATE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.collection.unshift(action.result.data);
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.MYPROJECT_CREATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.MYPROJECT_SHOW:
      const el = _.find(state.collection, { id: action.id });
      return { ...state, itemLoading: false, selectedItem: el };

    case t.MYPROJECT_EDIT:
      return { ...state, loading: true };
    case t.MYPROJECT_CLOSE:
      return { ...state, itemLoading: true };

    case t.MYPROJECT_CLOSE_SUCCESS:
    case t.MYPROJECT_EDIT_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        state.collection[ind] = action.result.data;
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.MYPROJECT_CLOSE_FAIL:
    case t.MYPROJECT_EDIT_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    default:
      return state;
  }
}
