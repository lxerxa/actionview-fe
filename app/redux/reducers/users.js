import {
  USERS_LOAD,
  USERS_LOAD_SUCCESS,
  USERS_LOAD_FAIL
} from '../constants/ActionTypes';

const initialState = { users: [] };

export default function users(state = initialState, action) {
  switch (action.type) {
    case USERS_LOAD:
      return {
        ...state,
        loading: true
      };
    case USERS_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.result
      };
    case USERS_LOAD_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
}
