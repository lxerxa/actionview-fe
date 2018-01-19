import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { ecode: 0, collection: [], options: {}, indexLoading: false, loading: false, itemLoading: false, selectedItem: {} };

export default function role(state = initialState, action) {
  switch (action.type) {
    case t.ROLE_INDEX:
    case t.ROLE_TEAM_INDEX:
      return { ...state, indexLoading: true, collection: [] };

    case t.ROLE_INDEX_SUCCESS:
    case t.ROLE_TEAM_INDEX_SUCCESS:
      if (action.result.ecode === 0) {
        state.collection = action.result.data;
        state.options = action.result.options || {};
      }
      return { ...state, indexLoading: false, ecode: action.result.ecode };

    case t.ROLE_INDEX_FAIL:
    case t.ROLE_TEAM_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    case t.ROLE_CREATE:
      return { ...state, loading: true };

    case t.ROLE_CREATE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.collection.push(action.result.data);
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.ROLE_CREATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.ROLE_UPDATE:
    case t.ROLE_SET_PERMISSIONS:
    case t.ROLE_SET_ACTOR:
    case t.ROLE_SET_GROUP_ACTOR:
      return { ...state, loading: true };

    case t.ROLE_UPDATE_SUCCESS:
    case t.ROLE_SET_PERMISSIONS_SUCCESS:
    case t.ROLE_SET_ACTOR_SUCCESS:
    case t.ROLE_SET_GROUP_ACTOR_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        state.collection[ind] = action.result.data;
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.ROLE_UPDATE_FAIL:
    case t.ROLE_SET_PERMISSIONS_FAIL:
    case t.ROLE_SET_ACTOR_FAIL:
    case t.ROLE_SET_GROUP_ACTOR_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.ROLE_SELECT:
      const el = _.find(state.collection, { id: action.id });
      return { ...state, itemLoading: false, selectedItem: el };

    case t.ROLE_RESET:
      return { ...state, itemLoading: true };

    case t.ROLE_RESET_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.id });
        state.collection[ind] = action.result.data;
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.ROLE_RESET_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.ROLE_DELETE:
      return { ...state, itemLoading: true };

    case t.ROLE_DELETE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.collection = _.reject(state.collection, { id: action.id });
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.ROLE_DELETE_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    default:
      return state;
  }
}
