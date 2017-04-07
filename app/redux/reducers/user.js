import at from '../constants/ActionTypes';

const initialState = { ecode: 0, collection: [], indexLoading: false, loading: false, itemLoading: false };

export default function users(state = initialState, action) {
  switch (action.type) {
    case at.USER_INDEX:
      return { ...state, indexLoading: true };

    case at.USER_INDEX_SUCCESS:
      return { ...state, indexLoading: false, collection: action.result.data };

    case at.USER_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    case at.USER_PWD_RETRIEVE:
      return { ...state, loading: true };

    case at.USER_PWD_RETRIEVE_SUCCESS:
      return { ...state, ecode: action.result.ecode, loading: false };

    case at.USER_PWD_RETRIEVE_FAIL:
      return { ...state, loading: false, error: action.error };

    case at.USER_REGISTER:
      return { ...state, loading: true };

    case at.USER_REGISTER_SUCCESS:
      return { ...state, ecode: action.result.ecode, loading: false };

    case at.USER_REGISTER_FAIL:
      return { ...state, loading: false, error: action.error };

    default:
      return state;
  }
}
