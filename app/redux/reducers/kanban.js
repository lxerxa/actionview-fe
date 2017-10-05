import * as t from '../constants/ActionTypes';

const initialState = { ecode: 0, latest_access_id: '', options: {}, loading: false, wfactions: [], wfLoading: false };

export default function activity(state = initialState, action) {
  switch (action.type) {
    case t.KANBAN_ACCESS_GET:
      return { ...state, loading: true, latest_access_id: '', options: {} };

    case t.KANBAN_ACCESS_GET_SUCCESS:
      if (action.result.ecode === 0) {
        state.latest_access_id = action.result.data.id || '';
        state.options = action.result.options || {};
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.KANBAN_ACCESS_GET_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.KANBAN_ISSUE_ACTIONS_GET:
      return { ...state, wfLoading: true, wfactions: [] };

    case t.KANBAN_ISSUE_ACTIONS_GET_SUCCESS:
      if (action.result.ecode === 0) {
        state.wfactions = action.result.data;
      }
      return { ...state, wfLoading: false, ecode: action.result.ecode };

    case t.KANBAN_ISSUE_ACTIONS_GET_FAIL:
      return { ...state, wfLoading: false, error: action.error };

    case t.KANBAN_ISSUE_ACTIONS_CLEAN:
      return { ...state, wfactions: [] };

    default:
      return state;
  }
}
