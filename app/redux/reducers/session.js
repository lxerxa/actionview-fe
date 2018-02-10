import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { ecode: 0, emsg: '', invalid: false, user: {} };

export default function session(state = initialState, action) {
  switch (action.type) {
    case t.SESSION_CREATE:
      return { ...state, loading: true, ecode: 0, emsg: '', invalid: false };

    case t.SESSION_CREATE_SUCCESS:
      if (action.result.ecode === 0) {
        state.user = action.result.data && action.result.data.user;
      }
      // for sentinel throttle
      if (action.result.emsg) {
        state.emsg = action.result.emsg
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.SESSION_CREATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.SESSION_GET:
      return { ...state, loading: true };

    case t.SESSION_GET_SUCCESS:
      if (action.result.ecode === 0) {
        state.user = action.result.data && action.result.data.user;
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.SESSION_GET_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.SESSION_DESTROY:
      return { ...state, loading: true };

    case t.SESSION_DESTROY_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.user = {};
        state.invalid = true;
      }
      return { ...state, ecode: action.result.ecode };

    case t.SESSION_DESTROY_FAIL:
      return { ...state, error: action.error };

    case t.SESSION_INVALIDATE:
      return { ...state, invalid: true };

    case t.SESSION_UPD_AVATAR:
      return { ...state, user: _.extend(state.user, { avatar: action.avatar }) };

    default:
      return state;
  }
}
