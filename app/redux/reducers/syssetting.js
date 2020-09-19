import * as t from '../constants/ActionTypes';

const initialState = { 
  ecode: 0, 
  loading: false, 
  settings: {} 
};

export default function syssetting(state = initialState, action) {
  switch (action.type) {
    case t.SYSSETTING_SHOW:
      return { ...state, loading: true };

    case t.SYSSETTING_SHOW_SUCCESS:
      if (action.result.ecode === 0) {
        state.settings = action.result.data || {};
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.SYSSETTING_SHOW_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.SYSSETTING_UPDATE:
    case t.SYSSETTING_RESET_PWD:
      return { ...state, loading: true };

    case t.SYSSETTING_UPDATE_SUCCESS:
    case t.SYSSETTING_RESET_PWD_SUCCESS:
      if (action.result.ecode === 0) {
        state.settings = action.result.data || {};
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.SYSSETTING_UPDATE_FAIL:
    case t.SYSSETTING_RESET_PWD_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.SYSSETTING_SEND_TESTMAIL:
      return { ...state, loading: true };

    case t.SYSSETTING_SEND_TESTMAIL_SUCCESS:
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.SYSSETTING_SEND_TESTMAIL_FAIL:
      return { ...state, loading: false, error: action.error };

    default:
      return state;
  }
}
