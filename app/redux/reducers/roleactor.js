import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { ecode: 0, collection: [], item: {}, options: {}, indexLoading: false, loading: false, itemLoading: false, selectedItem: {} };

export default function roleactor(state = initialState, action) {
  switch (action.type) {
    case t.ROLEACTOR_INDEX:
      return { ...state, indexLoading: true, collection: [] };

    case t.ROLEACTOR_INDEX_SUCCESS:
      return { ...state, indexLoading: false, ecode: action.result.ecode, collection: action.result.data, options: action.result.options };

    case t.ROLEACTOR_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    case t.ROLEACTOR_EDIT:
      return { ...state, loading: true };

    case t.ROLEACTOR_EDIT_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        state.collection[ind] = action.result.data;
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.ROLEACTOR_EDIT_FAIL:
      return { ...state, loading: false, error: action.error };

    default:
      return state;
  }
}
