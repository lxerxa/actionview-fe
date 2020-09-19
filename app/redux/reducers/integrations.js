import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { 
  ecode: 0, 
  collection: [], 
  options: {}, 
  indexLoading: false, 
  itemLoading: false, 
  selectedItem: {} 
};

export default function resolution(state = initialState, action) {
  switch (action.type) {
    case t.INTEGRATIONS_INDEX:
      return { ...state, indexLoading: true, itemLoading: false, collection: [] };

    case t.INTEGRATIONS_INDEX_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.collection = action.result.data;
      }
      return { ...state, indexLoading: false, ecode: action.result.ecode };

    case t.INTEGRATIONS_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    case t.INTEGRATIONS_HANDLE:
      return { ...state, itemLoading: true };

    case t.INTEGRATIONS_HANDLE_SUCCESS:
      if (action.result.ecode === 0) {
        const ind = _.findIndex(state.collection, { user: action.result.data.user });
        if (ind !== -1) {
          state.collection[ind] = action.result.data;
        } else {
          state.collection.push(action.result.data);
        }
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.INTEGRATIONS_HANDLE_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    default:
      return state;
  }
}
