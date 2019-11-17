import * as t from '../constants/ActionTypes';

const initialState = { 
  ecode: 0, 
  options: {}, 
  collection: [], 
  indexLoading: false 
};

export default function logs(state = initialState, action) {
  switch (action.type) {
    case t.LOGS_INDEX:
      return { ...state, indexLoading: true, collection: [] };

    case t.LOGS_INDEX_SUCCESS:
      if (action.result.ecode === 0) {
        state.collection = action.result.data;
        state.options = action.result.options;
      }
      return { ...state, indexLoading: false, ecode: action.result.ecode };

    case t.LOGS_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    default:
      return state;
  }
}
