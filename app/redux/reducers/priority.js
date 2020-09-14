import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { 
  ecode: 0, 
  collection: [], 
  indexLoading: false, 
  loading: false, 
  itemLoading: false, 
  sortLoading: false, 
  defaultLoading: false, 
  selectedItem: {},
  usedProjects: [] 
};

export default function priority(state = initialState, action) {
  switch (action.type) {
    case t.PRIORITY_INDEX:
      return { ...state, indexLoading: true, loading: false, itemLoading: false, collection: [] };

    case t.PRIORITY_INDEX_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.collection = action.result.data;
      }
      return { ...state, indexLoading: false, ecode: action.result.ecode };

    case t.PRIORITY_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    case t.PRIORITY_CREATE:
      return { ...state, loading: true };

    case t.PRIORITY_CREATE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.collection.push(action.result.data);
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.PRIORITY_CREATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.PRIORITY_UPDATE:
      return { ...state, loading: true };

    case t.PRIORITY_UPDATE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        _.extend(state.collection[ind], action.result.data);
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.PRIORITY_UPDATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.PRIORITY_SELECT:
      const el = _.find(state.collection, { id: action.id });
      return { ...state, itemLoading: false, selectedItem: el };

    case t.PRIORITY_DELETE:
      return { ...state, itemLoading: true };

    case t.PRIORITY_DELETE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.collection = _.reject(state.collection, { id: action.id });
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.PRIORITY_DELETE_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.PRIORITY_SET_SORT:
      return { ...state, sortLoading: true };

    case t.PRIORITY_SET_SORT_SUCCESS:
      if ( action.result.ecode === 0 ) {
        if (action.result.data.sequence) {
          const newCollection = [];
          _.map(action.result.data.sequence, (v) => {
            const index = _.findIndex(state.collection, { id: v });
            if (index !== -1) {
              newCollection.push(state.collection[index]);
            }
          });
          state.collection = newCollection;
        }
      }
      return { ...state, sortLoading: false, ecode: action.result.ecode };

    case t.PRIORITY_SET_SORT_FAIL:
      return { ...state, sortLoading: false, error: action.error };

    case t.PRIORITY_SET_DEFAULT:
      return { ...state, defaultLoading: true };

    case t.PRIORITY_SET_DEFAULT_SUCCESS:
      if ( action.result.ecode === 0 ) {
        if (action.result.data.default) {
          _.map(state.collection, (v) => {
            if (v.id === action.result.data.default) {
              v.default = true;
            } else if (v.default) {
              v.default = false;
            }
          });
        }
      } 
      return { ...state, defaultLoading: false, ecode: action.result.ecode };

    case t.PRIORITY_SET_DEFAULT_FAIL:
      return { ...state, defaultLoading: false, error: action.error };

    case t.PRIORITY_VIEW_USED:
      return { ...state, loading: true, usedProjects: [] };

    case t.PRIORITY_VIEW_USED_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.usedProjects = action.result.data;
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.PRIORITY_VIEW_USED_FAIL:
      return { ...state, loading: false, error: action.error };

    default:
      return state;
  }
}
