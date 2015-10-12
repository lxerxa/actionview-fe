import at from '../constants/ActionTypes';

const initialState = { collection: [] };

export default function users(state = initialState, action) {
  switch (action.type) {
    case at.USERS_INDEX:
      return { ...state, loading: true };

    case at.USERS_INDEX_SUCCESS:
      return { ...state, loading: false, collection: action.result };

    case at.USERS_INDEX_FAIL:
      return { ...state, loading: false, error: action.error };

    case at.USERS_SHOW:
      return { ...state, loading: true };

    case at.USERS_SHOW_SUCCESS:
      // clone `state.collection`
      let collection = [ ...state.collection ];

      // find fetched user into collection
      const { seed } = action.result;
      if (!collection.find(user => user.seed === seed)) {
        collection = [ action.result, ...state.collection ];
      }

      // return modified state
      return { ...state, loading: false, collection };

    case at.USERS_SHOW_FAIL:
      return { ...state, loading: false, error: action.error };

    case at.USERS_CLEAR_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
}
