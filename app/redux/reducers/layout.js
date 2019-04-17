import * as t from '../constants/ActionTypes';

const initialState = { containerWidth: 0, siderWidth: 0 };

export default function layout(state = initialState, action) {
  switch (action.type) {
    case t.LAYOUT_RESIZE:
      return { ...state, containerWidth: action.values.containerWidth || 0, siderWidth: action.values.siderWidth || 0 };

    default:
      return state;
  }
}
