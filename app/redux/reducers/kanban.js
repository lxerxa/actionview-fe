import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { 
  ecode: 0, 
  list: [], 
  sprints: [],
  loading: false, 
  sprintLoading: false, 
  rankLoading: false, 
  configLoading: false, 
  wfactions: [], 
  wfLoading: false, 
  draggedIssue: '' };

export default function kanban(state = initialState, action) {
  switch (action.type) {
    case t.KANBAN_LIST_GET:
      return { ...state, loading: true, rankable: true, list: [], sprints: [] };

    case t.KANBAN_LIST_GET_SUCCESS:
      if (action.result.ecode === 0) {
        state.list = action.result.data || [];
        state.sprints = action.result.options && action.result.options.sprints || [];
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

    case t.KANBAN_BACKLOG_ISSUE_DRAG:
      return { ...state, draggedIssue: action.id };

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

    case t.KANBAN_ISSUE_RANK_SET:
      return { ...state, rankLoading: true };

    case t.KANBAN_ISSUE_RANK_SET_SUCCESS:
      return { ...state, rankLoading: false, ecode: action.result.ecode };

    case t.KANBAN_ISSUE_RANK_SET_FAIL:
      return { ...state, rankLoading: false, error: action.error };

    case t.KANBAN_BACKLOG_ISSUE_MOVE: 
    case t.KANBAN_SPRINT_CREATE:
    case t.KANBAN_SPRINT_COMPLETE:
    case t.KANBAN_SPRINT_PUBLISH:
    case t.KANBAN_SPRINT_DELETE:
      return { ...state, sprintLoading: true };

    case t.KANBAN_BACKLOG_ISSUE_MOVE_SUCCESS: 
    case t.KANBAN_SPRINT_CREATE_SUCCESS:
    case t.KANBAN_SPRINT_COMPLETE_SUCCESS:
    case t.KANBAN_SPRINT_PUBLISH_SUCCESS:
    case t.KANBAN_SPRINT_DELETE_SUCCESS:
      if (action.result.ecode === 0) {
        state.sprints = action.result.data;
      }
      return { ...state, sprintLoading: false, ecode: action.result.ecode };

    case t.KANBAN_BACKLOG_ISSUE_MOVE_FAIL: 
    case t.KANBAN_SPRINT_CREATE_FAIL:
    case t.KANBAN_SPRINT_COMPLETE_FAIL:
    case t.KANBAN_SPRINT_PUBLISH_FAIL:
    case t.KANBAN_SPRINT_DELETE_FAIL:
      return { ...state, sprintLoading: false, error: action.error };

    default:
      return state;
  }
}
