import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { ecode: 0, collection: [], indexLoading: false };

export default function activity(state = initialState, action) {
  switch (action.type) {
    case t.ACTIVITY_INDEX:
      return { ...state, indexLoading: true, collection: [] };

    case t.ACTIVITY_INDEX_SUCCESS:
      return { ...state, indexLoading: false, ecode: action.result.ecode, collection: action.result.data };

    case t.ACTIVITY_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    default:
      return state;
  }
}
