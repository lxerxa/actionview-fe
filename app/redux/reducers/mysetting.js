import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { ecode: 0, loading: false, avatarLoading: false, accountLoading: false, accounts: {}, notifyLoading: false, notifications: {}, favoriteLoading: false, favorites: {} };

export default function mysetting(state = initialState, action) {
  switch (action.type) {
    case t.MYSETTING_USER_SHOW:
      return { ...state, loading: true };

    case t.MYSETTING_USER_SHOW_SUCCESS:
      return { ...state, loading: false, ecode: action.result.ecode, accounts: action.result.data.accounts || {}, notifications: action.result.data.notifications || {}, favorites: action.result.data.favorites || {} };

    case t.MYSETTING_USER_SHOW_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.MYSETTING_SET_AVATAR:
      return { ...state, avatarLoading: true };

    case t.MYSETTING_ACCOUNT_UPDATE:
      return { ...state, accountLoading: true };

    case t.MYSETTING_SET_AVATAR_SUCCESS:
    case t.MYSETTING_ACCOUNT_UPDATE_SUCCESS:
      return { ...state, accountLoading: false, avatarLoading: false, ecode: action.result.ecode, accounts: action.result.data.accounts || {} };

    case t.MYSETTING_SET_AVATAR_FAIL:
      return { ...state, avatarLoading: false, error: action.error };

    case t.MYSETTING_ACCOUNT_UPDATE_FAIL:
      return { ...state, accountLoading: false, error: action.error };

    case t.MYSETTING_PWD_RESET:
      return { ...state, accountLoading: true };

    case t.MYSETTING_PWD_RESET_SUCCESS:
      return { ...state, accountLoading: false, ecode: action.result.ecode };

    case t.MYSETTING_PWD_RESET_FAIL:
      return { ...state, accountLoading: false, error: action.error };

    case t.MYSETTING_NOTIFY_UPDATE:
      return { ...state, notifyLoading: true };

    case t.MYSETTING_NOTIFY_UPDATE_SUCCESS:
      return { ...state, notifyLoading: false, ecode: action.result.ecode, notifications: action.result.data.notifications || {} };

    case t.MYSETTING_NOTIFY_UPDATE_FAIL:
      return { ...state, notifyLoading: false, error: action.error };

    case t.MYSETTING_FAVORITE_UPDATE:
      return { ...state, favoriteLoading: true };

    case t.MYSETTING_FAVORITE_UPDATE_SUCCESS:
      return { ...state, favoriteLoading: false, ecode: action.result.ecode, favorites: action.result.data.favorites || {} };

    case t.MYSETTING_FAVORITE_UPDATE_FAIL:
      return { ...state, favoriteLoading: false, error: action.error };

    default:
      return state;
  }
}
