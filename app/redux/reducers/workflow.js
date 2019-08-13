import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { 
  ecode: 0, 
  collection: [], 
  indexLoading: false, 
  loading: false, 
  itemLoading: false, 
  selectedItem: {}, 
  itemSteps: [],
  usedProjects: [] };

export default function workflow(state = initialState, action) {
  switch (action.type) {
    case t.WORKFLOW_INDEX:
      return { ...state, indexLoading: true, collection: [] };

    case t.WORKFLOW_INDEX_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.collection = action.result.data;
      }
      return { ...state, indexLoading: false, ecode: action.result.ecode };

    case t.WORKFLOW_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    case t.WORKFLOW_CREATE:
      return { ...state, loading: true };

    case t.WORKFLOW_CREATE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.collection.push(action.result.data);
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.WORKFLOW_CREATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.WORKFLOW_UPDATE:
      return { ...state, loading: true };

    case t.WORKFLOW_UPDATE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        _.extend(state.collection[ind], action.result.data);
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.WORKFLOW_UPDATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.WORKFLOW_SELECT:
      return { ...state, itemLoading: false, selectedItem: _.find(state.collection, { id: action.id }) };

    case t.WORKFLOW_DELETE:
      return { ...state, itemLoading: true };

    case t.WORKFLOW_DELETE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.collection = _.reject(state.collection, { id: action.id });
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.WORKFLOW_DELETE_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.WORKFLOW_PREVIEW:
      return { ...state, selectedItem: _.find(state.collection, { id: action.id }), itemLoading: true };

    case t.WORKFLOW_PREVIEW_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.itemSteps = action.result.data.contents && action.result.data.contents.steps ? action.result.data.contents.steps : [];
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.WORKFLOW_PREVIEW_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.WORKFLOW_VIEW_USED:
      return { ...state, loading: true, usedProjects: [] };

    case t.WORKFLOW_VIEW_USED_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.usedProjects = action.result.data;
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.WORKFLOW_VIEW_USED_FAIL:
      return { ...state, loading: false, error: action.error };

    default:
      return state;
  }
}
