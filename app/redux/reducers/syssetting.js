import * as t from '../constants/ActionTypes';

const initialState = { ecode: 0, loading: false, settings: {} };

export default function syssetting(state = initialState, action) {
  switch (action.type) {
    case t.SYSSETTING_SHOW:
      return { ...state, loading: true };

    case t.SYSSETTING_SHOW_SUCCESS:
      return { ...state, loading: false, ecode: action.result.ecode, settings: action.result.data || {} };

    case t.SYSSETTING_SHOW_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.SYSSETTING_UPDATE:
      return { ...state, loading: true };

    case t.SYSSETTING_UPDATE_SUCCESS:
      return { ...state, loading: false, ecode: action.result.ecode, settings: action.result.data || {} };

    case t.SYSSETTING_UPDATE_FAIL:
      return { ...state, loading: false, error: action.error };

    default:
      return state;
  }
}
