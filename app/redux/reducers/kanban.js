import * as t from '../constants/ActionTypes';

const initialState = { ecode: 0, rankable: true, list: [], loading: false, wfactions: [], wfLoading: false, draggedIssue: '' };

export default function activity(state = initialState, action) {
  switch (action.type) {
    case t.KANBAN_LIST_GET:
      return { ...state, loading: true, latest_access_id: '', list: [] };

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

    default:
      return state;
  }
}
