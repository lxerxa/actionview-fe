import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { ecode: 0, collection: [], collection2JSON: '', options: {}, indexLoading: false, saveLoading: false };

export default function wfconfig(state = initialState, action) {
  const { collection } = state;

  switch (action.type) {
    case t.WFCONFIG_INDEX:
      return { ...state, indexLoading: true, collection: [] };

    case t.WFCONFIG_INDEX_SUCCESS:
      if (action.result.ecode === 0) {
        state.collection = action.result.data.contents && action.result.data.contents.steps ? action.result.data.contents.steps : [];
        state.collection2JSON = JSON.stringify(state.collection);
        state.workflowId = action.result.data.id;
        state.workflowName = action.result.data.name;
        state.options = action.result.options;
      }
      return { ...state, indexLoading: false, ecode: action.result.ecode };

    case t.WFCONFIG_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    case t.WFCONFIG_SAVE:
      return { ...state, saveLoading: true };

    case t.WFCONFIG_SAVE_SUCCESS:
      return action.result.ecode === 0 ? 
        { ...state, saveLoading: false, ecode: action.result.ecode, collection2JSON: JSON.stringify(state.collection) } :
        { ...state, saveLoading: false, ecode: action.result.ecode };

    case t.WFCONFIG_SAVE_FAIL:
      return { ...state, saveLoading: false, error: action.error };

    case t.WFCONFIG_STEP_CREATE:
      const maxStep = _.max(collection, step => step.id).id || 0;
      collection.push({ id: maxStep+1, name: action.values.name, state: action.values.state, actions: [] });
      return { ...state, collection };

    case t.WFCONFIG_STEP_EDIT:
      const index = _.findIndex(collection, { id: action.values.id });
      collection[index]['name'] = action.values.name;
      collection[index]['state'] = action.values.state;
      return { ...state, collection };

    case t.WFCONFIG_STEP_DELETE:
      const inx = _.findIndex(collection, { id: action.id });
      collection.splice(inx, 1);
      return { ...state, collection: collection };

    case t.WFCONFIG_ACTION_ADD:
      const stepIndex = _.findIndex(collection, { id: action.stepId });
      if (!collection[stepIndex].actions)
      {
        collection[stepIndex].actions = [];
      }
      const maxAction = _.max(collection[stepIndex].actions, value => value.id).id || 0;
      action.values.id = action.stepId * 1000 + maxAction % 1000 + 1;
      collection[stepIndex].actions.push(action.values);

      return { ...state, collection };

    case t.WFCONFIG_ACTION_EDIT:
      const stepInd = _.findIndex(collection, { id: action.stepId });
      const actionInd = _.findIndex(collection[stepInd].actions, { id: action.values.id })
      collection[stepInd].actions[actionInd] = action.values;
      return { ...state, collection };

    case t.WFCONFIG_ACTION_DELETE:
      const sInd = _.findIndex(collection, { id: action.stepId });
      collection[sInd].actions = _.filter(collection[sInd].actions, function(v) { return _.indexOf(action.values, v.id) === -1 });
      return { ...state, collection };

    case t.WFCONFIG_CANCEL:
      state.collection = JSON.parse(state.collection2JSON);
      return { ...state };

    default:
      return state;
  }
}
