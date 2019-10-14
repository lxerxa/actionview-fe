import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { 
  ecode: 0, 
  current_time: 1, 
  collection: [], 
  increaseCollection: [], 
  indexLoading: false, 
  moreLoading: false 
};

export default function activity(state = initialState, action) {
  switch (action.type) {
    case t.ACTIVITY_INDEX:
      return { ...state, indexLoading: true, collection: [], increaseCollection: [] };

    case t.ACTIVITY_INDEX_SUCCESS:
      if (action.result.ecode === 0) {
        state.collection = action.result.data;
        state.increaseCollection = action.result.data;
        state.current_time = action.result.options.current_time;
      }
      return { ...state, indexLoading: false, ecode: action.result.ecode };

    case t.ACTIVITY_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    case t.ACTIVITY_MORE:
      return { ...state, moreLoading: true };

    case t.ACTIVITY_MORE_SUCCESS:
      if (action.result.ecode === 0) {
        state.collection = state.collection.concat(action.result.data);
        state.increaseCollection = action.result.data;
        state.current_time = action.result.options.current_time;
      }
      return { ...state, moreLoading: false, ecode: action.result.ecode };

    case t.ACTIVITY_MORE_FAIL:
      return { ...state, moreLoading: false, error: action.error };

    default:
      return state;
  }
}
