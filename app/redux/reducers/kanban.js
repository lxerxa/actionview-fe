import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { 
  ecode: 0, 
  selectedFilter: 'all', 
  list: [], 
  loading: false, 
  rankLoading: false, 
  configLoading: false, 
  wfactions: [], 
  wfLoading: false, 
  draggedIssue: '' };

export default function kanban(state = initialState, action) {
  switch (action.type) {
    case t.KANBAN_LIST_GET:
      return { ...state, loading: true, rankable: true, list: [] };

    case t.KANBAN_LIST_GET_SUCCESS:
      if (action.result.ecode === 0) {
        state.list = action.result.data || [];
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.KANBAN_LIST_GET_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.KANBAN_CREATE:
      return { ...state, configLoading: true };

    case t.KANBAN_CREATE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.list.push(action.result.data);
      }
      return { ...state, configLoading: false, ecode: action.result.ecode };

    case t.KANBAN_CREATE_FAIL:
      return { ...state, configLoading: false, error: action.error };

    case t.KANBAN_UPDATE:
      return { ...state, configLoading: true };

    case t.KANBAN_UPDATE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.list, { id: action.result.data.id });
        state.list[ind] = action.result.data;
      }
      return { ...state, configLoading: false, ecode: action.result.ecode };

    case t.KANBAN_UPDATE_FAIL:
      return { ...state, configLoading: false, error: action.error };

    case t.KANBAN_DELETE:
      return { ...state, configLoading: true };

    case t.KANBAN_DELETE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.list = _.reject(state.list, { id: action.id });
      }
      return { ...state, configLoading: false, ecode: action.result.ecode };

    case t.TYPE_DELETE_FAIL:
      return { ...state, configLoading: false, error: action.error };

    case t.KANBAN_ISSUE_ACTIONS_GET:
      return { ...state, wfLoading: true, draggedIssue: action.id, wfactions: [] };

    case t.KANBAN_ISSUE_ACTIONS_GET_SUCCESS:
      if (action.result.ecode === 0) {
        state.wfactions = action.result.data;
      }
      return { ...state, wfLoading: false, ecode: action.result.ecode };

    case t.KANBAN_ISSUE_ACTIONS_GET_FAIL:
      return { ...state, wfLoading: false, error: action.error };

    case t.KANBAN_ISSUE_ACTIONS_CLEAN:
      return { ...state, draggedIssue: '', wfactions: [] };

    case t.KANBAN_SELECT_FILTER:
      return { ...state, selectedFilter: action.key };

    case t.KANBAN_ISSUE_RANK_SET:
      return { ...state, rankLoading: true };

    case t.KANBAN_ISSUE_RANK_SET_SUCCESS:
      return { ...state, rankLoading: false, ecode: action.result.ecode };

    case t.KANBAN_ISSUE_RANK_SET_FAIL:
      return { ...state, rankLoading: false, error: action.error };

    default:
      return state;
  }
}
