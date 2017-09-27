import * as t from '../constants/ActionTypes';

const initialState = { ecode: 0, latest_access_id: '', options: {}, loading: false };

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

    default:
      return state;
  }
}
