import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { ecode: 0, rankable: true, list: [], loading: false, rankLoading: false, wfactions: [], wfLoading: false, draggedIssue: '' };

export default function activity(state = initialState, action) {
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

    case t.KANBAN_SWITCH_RANK:
      return { ...state, rankable: action.flag };

    case t.KANBAN_ISSUE_RANK_GET:
    case t.KANBAN_ISSUE_RANK_SET:
      return { ...state, rankLoading: true };

    case t.KANBAN_ISSUE_RANK_GET_SUCCESS:
    case t.KANBAN_ISSUE_RANK_SET_SUCCESS:
      if (action.result.ecode === 0) {
        const curKanbanInd = _.findIndex(state.list, { id: action.kid });
        if (curKanbanInd !== -1) {
          state.list[curKanbanInd].ranks = action.result.data;
        }
      }
      return { ...state, rankLoading: false, ecode: action.result.ecode };

    case t.KANBAN_ISSUE_RANK_GET_FAIL:
    case t.KANBAN_ISSUE_RANK_SET_FAIL:
      return { ...state, rankLoading: false, error: action.error };

    default:
      return state;
  }
}
