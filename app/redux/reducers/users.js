import findIndex from 'lodash/array/findIndex';
import t from '../constants/ActionTypes';

const initialState = { collection: [] };

export default function users(state = initialState, action) {
  switch (action.type) {
    case t.USERS_INDEX:
      return { ...state, loading: true };

    case t.USERS_INDEX_SUCCESS:
      return { ...state, loading: false, collection: action.result };

    case t.USERS_INDEX_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.USERS_SHOW:
      return { ...state, loading: true };

    case t.USERS_SHOW_SUCCESS:
      // clone `state.collection`
      let collection = [ ...state.collection ];

      // find fetched user into collection
      const { seed } = action.result;
      const index = findIndex(collection, { seed });

      if (index > -1) {
        // update the user if he exists
        collection[index] = action.result;
      } else {
        // else add new user into collection
        collection = [ action.result, ...state.collection ];
      }

      // return modified state
      return { ...state, loading: false, collection };

    case t.USERS_SHOW_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.USERS_CLEAR_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
}
