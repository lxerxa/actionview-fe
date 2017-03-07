import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { ecode: 0, collection: [], increaseCollection: [], indexLoading: false, moreLoading: false };

export default function activity(state = initialState, action) {
  switch (action.type) {
    case t.ACTIVITY_INDEX:
      return { ...state, indexLoading: true, collection: [], increaseCollection: [] };

    case t.ACTIVITY_INDEX_SUCCESS:
      return { ...state, indexLoading: false, ecode: action.result.ecode, collection: action.result.data, increaseCollection: action.result.data };

    case t.ACTIVITY_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    case t.ACTIVITY_MORE:
      return { ...state, moreLoading: true };

    case t.ACTIVITY_MORE_SUCCESS:
      return { ...state, moreLoading: false, ecode: action.result.ecode, collection: state.collection.concat(action.result.data), increaseCollection: action.result.data };

    case t.ACTIVITY_MORE_FAIL:
      return { ...state, moreLoading: false, error: action.error };

    default:
      return state;
  }
}
