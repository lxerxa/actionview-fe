import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { ecode: 0, loading: false, accounts: {}, notifications: {}, favorites: {} };

export default function mysetting(state = initialState, action) {
  switch (action.type) {
    case t.MYSETTING_USER_SHOW:
      return { ...state, loading: true };

    case t.MYSETTING_USER_SHOW_SUCCESS:
      return { ...state, loading: false, ecode: action.result.ecode, accounts: action.result.data.accounts || {}, notifications: action.result.data.notifications || {}, favorites: action.result.data.favorites || {} };

    case t.MYSETTING_USER_SHOW_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.MYSETTING_ACCOUNT_UPDATE:
      return { ...state, loading: true };

    case t.MYSETTING_ACCOUNT_UPDATE_SUCCESS:
      return { ...state, loading: false, ecode: action.result.ecode, accounts: action.result.data.accounts || {} };

    case t.MYSETTING_ACCOUNT_UPDATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.MYSETTING_NOTIFY_UPDATE:
      return { ...state, loading: true };

    case t.MYSETTING_NOTIFY_UPDATE_SUCCESS:
      return { ...state, loading: false, ecode: action.result.ecode, notifications: action.result.data.notifications || {} };

    case t.MYSETTING_NOTIFY_UPDATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.MYSETTING_FAVORITE_UPDATE:
      return { ...state, loading: true };

    case t.MYSETTING_FAVORITE_UPDATE_SUCCESS:
      return { ...state, loading: false, ecode: action.result.ecode, favorites: action.result.data.favorites || {} };

    case t.MYSETTING_FAVORITE_UPDATE_FAIL:
      return { ...state, loading: false, error: action.error };

    default:
      return state;
  }
}
