import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { 
  ecode: 0, 
  collection: [], 
  indexLoading: false, 
  increaseCollection: [], 
  moreLoading: false, 
  itemLoading: false, 
  item: {}, 
  loading: false, 
  options: {}, 
  recents: [], 
  recentsLoading: false, 
  selectedItem: {}
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case t.USER_REGISTER:
      return { ...state, loading: true };

    case t.USER_REGISTER_SUCCESS:
      return { ...state, ecode: action.result.ecode, loading: false };

    case t.USER_REGISTER_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.USER_INDEX:
      return { ...state, indexLoading: true, collection: [], increaseCollection: [] };

    case t.USER_INDEX_SUCCESS:
      if (action.result.ecode === 0) {
        _.assign(state.options, action.result.options || {});
        state.collection = action.result.data;
      }
      return { ...state, indexLoading: false, ecode: action.result.ecode };

    case t.USER_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    case t.USER_CREATE:
      return { ...state, loading: true };

    case t.USER_CREATE_SUCCESS:
      if (action.result.ecode === 0) {
        state.collection.unshift(action.result.data);
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.USER_CREATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.USER_IMPORTS:
      return { ...state, loading: true };

    case t.USER_IMPORTS_SUCCESS:
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.USER_IMPORTS_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.USER_PWD_RESET:
    case t.USER_PWD_RESET_SENDMAIL:
      return { ...state, loading: false };

    case t.USER_PWD_RESET_ACCESS:
      return { ...state, loading: true };

    case t.USER_PWD_RESET_SUCCESS:
    case t.USER_PWD_RESET_ACCESS_SUCCESS:
    case t.USER_PWD_RESET_SENDMAIL_SUCCESS:
      return { ...state, ecode: action.result.ecode, item: action.result.data || {}, loading: false };

    case t.USER_PWD_RESET_FAIL:
    case t.USER_PWD_RESET_ACCESS_FAIL:
    case t.USER_PWD_RESET_SENDMAIL_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.USER_UPDATE:
      return { ...state, loading: true };

    case t.USER_UPDATE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        state.collection[ind] = action.result.data;
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.USER_UPDATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.USER_PWD_RENEW:
    case t.USER_INVALIDATE:
    case t.USER_DELETE:
      return { ...state, itemLoading: true };

    case t.USER_PWD_RENEW_SUCCESS:
      return { ...state, itemLoading: false, ecode: action.result.ecode };
    case t.USER_INVALIDATE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        state.collection[ind] = action.result.data;
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };
    case t.USER_DELETE_SUCCESS:
      if (action.result.ecode === 0) {
        state.collection = _.reject(state.collection, { id: action.id });
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.USER_PWD_RENEW_FAIL:
    case t.USER_INVALIDATE_FAIL:
    case t.USER_DELETE_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.USER_MULTI_DELETE:
    case t.USER_MULTI_PWDRENEW:
    case t.USER_MULTI_INVALIDATE:
      return { ...state, loading: true };

    case t.USER_MULTI_DELETE_SUCCESS:
      if (action.result.ecode === 0) {
        state.collection = _.reject(state.collection, (v) => { return action.ids.indexOf(v.id) !== -1 });
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.USER_MULTI_INVALIDATE_SUCCESS:
      if (action.result.ecode === 0) {
        _.map(state.collection, (v) => { if (action.ids.indexOf(v.id) !== -1) v.status = (action.flag == 1 ? 'invalid' : 'active'); });
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.USER_MULTI_PWDRENEW_SUCCESS:
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.USER_MULTI_PWDRENEW_FAIL:
    case t.USER_MULTI_INVALIDATE_FAIL:
    case t.USER_MULTI_DELETE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.USER_SELECT:
      const el = _.find(state.collection, { id: action.id });
      return { ...state, selectedItem: el };

    default:
      return state;
  }
}
