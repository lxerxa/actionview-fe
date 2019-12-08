import * as t from '../constants/ActionTypes';

const initialState = { 
  ecode: 0, 
  options: {}, 
  collection: [], 
  loading: false, 
  indexLoading: false 
};

export default function calendar(state = initialState, action) {
  switch (action.type) {
    case t.CALENDAR_INDEX:
      return { ...state, indexLoading: true, collection: [] };

    case t.CALENDAR_INDEX_SUCCESS:
      if (action.result.ecode === 0) {
        state.collection = action.result.data;
        state.options = action.result.options;
      }
      return { ...state, indexLoading: false, ecode: action.result.ecode };

    case t.CALENDAR_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    case t.CALENDAR_SYNC:
    case t.CALENDAR_SETTING:
      return { ...state, loading: true, collection: [] };

    case t.CALENDAR_SYNC_SUCCESS:
    case t.CALENDAR_SETTING_SUCCESS:
      if (action.result.ecode === 0) {
        state.collection = action.result.data;
        state.options = action.result.options;
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.CALENDAR_SYNC_FAIL:
    case t.CALENDAR_SETTING_FAIL:
      return { ...state, loading: false, error: action.error };

    default:
      return state;
  }
}
