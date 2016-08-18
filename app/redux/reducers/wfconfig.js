import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { ecode: 0, collection: [], options: {}, indexLoading: false };

export default function wfconfig(state = initialState, action) {
  switch (action.type) {
    case t.WFCONFIG_INDEX:
      return { ...state, indexLoading: true, collection: [] };

    case t.WFCONFIG_INDEX_SUCCESS:
      return { ...state, indexLoading: false, ecode: action.result.ecode, collection: action.result.data, options: action.result.options };

    case t.WFCONFIG_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    case t.WFSTEP_CREATE:
      return { ...state, collection: [] };

    default:
      return state;
  }
}
