import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { ecode: 0, collection: [], indexLoading: false, increaseCollection: [], moreLoading: false, itemLoading: false, item: {}, loading: false, options: {}, recents: [], recentsLoading: false, selectedItem: {} };

export default function project(state = initialState, action) {
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
      _.assign(state.options, action.result.options || {});
      return { ...state, indexLoading: false, ecode: action.result.ecode, collection: action.result.data };

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

    case t.USER_PWD_RESET:
      return { ...state, loading: true };

    case t.USER_PWD_RESET_SUCCESS:
      return { ...state, ecode: action.result.ecode, loading: false };

    case t.USER_PWD_RESET_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.USER_UPDATE:
      return { ...state, loading: true };
    case t.USER_CLOSE:
    case t.USER_REOPEN:
      return { ...state, itemLoading: true };

    case t.USER_CLOSE_SUCCESS:
    case t.USER_REOPEN_SUCCESS:
    case t.USER_UPDATE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        state.collection[ind] = action.result.data;
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.USER_CLOSE_FAIL:
    case t.USER_REOPEN_FAIL:
    case t.USER_UPDATE_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.USER_MULTI_CLOSE:
    case t.USER_MULTI_REOPEN:
      return { ...state, loading: false };

    case t.USER_MULTI_CLOSE_SUCCESS:
      if (action.result.ecode === 0) {
        _.map(state.collection, (v, i) => {
          if (action.ids.indexOf(v.id) !== -1) {
            state.collection[i].status = 'closed';
          }
        });
      }
      return { ...state, loading: true, ecode: action.result.ecode };
    case t.USER_MULTI_REOPEN_SUCCESS:
      if (action.result.ecode === 0) {
        _.map(state.collection, (v, i) => {
          if (action.ids.indexOf(v.id) !== -1) {
            state.collection[i].status = 'active';
          }
        });
      }
      return { ...state, loading: true, ecode: action.result.ecode };

    case t.USER_MULTI_CLOSE_FAIL:
    case t.USER_MULTI_REOPEN_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.USER_SELECT:
      const el = _.find(state.collection, { id: action.id });
      return { ...state, selectedItem: el };

    default:
      return state;
  }
}
