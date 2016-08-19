import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { ecode: 0, collection: [], options: {}, indexLoading: false };

export default function wfconfig(state = initialState, action) {
  switch (action.type) {
    case t.WFCONFIG_INDEX:
      return { ...state, indexLoading: true, collection: [] };

    case t.WFCONFIG_INDEX_SUCCESS:
      return { ...state, indexLoading: false, ecode: action.result.ecode, collection: action.result.data, options: action.result.options };

    case t.WFCONFIG_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    case t.WFCONFIG_STEP_CREATE:
      const { collection } = state;
      const maxStep = _.max(collection, step => step.id).id;
      collection.push({ id: maxStep+1, name: action.values.name, state: action.values.state, actions: [], results: [] });
      return { ...state, collection };

    case t.WFCONFIG_STEP_EDIT:
      return { ...state };

    default:
      return state;
  }
}
