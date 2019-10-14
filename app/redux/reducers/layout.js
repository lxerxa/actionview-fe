import * as t from '../constants/ActionTypes';

const initialState = { 
  sidebarHide: false,
  containerWidth: 0, 
  siderWidth: 0 
};

export default function layout(state = initialState, action) {
  switch (action.type) {
    case t.LAYOUT_RESIZE:
      return { ...state, containerWidth: action.values.containerWidth || state.containerWidth, sidebarHide: action.values.sidebarHide === undefined ? state.sidebarHide : action.values.sidebarHide };

    default:
      return state;
  }
}
