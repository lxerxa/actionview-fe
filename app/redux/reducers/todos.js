import {
  ADD_TODO,
  ADD_TODO_SUCCESS,
  ADD_TODO_FAIL,
  TODOS_LOAD,
  TODOS_LOAD_SUCCESS,
  TODOS_LOAD_FAIL
} from '../constants/ActionTypes';

const initialState = { todos: [] };

export default function todos(state = initialState, action) {
  switch (action.type) {
    case TODOS_LOAD:
      return {
        ...state,
        loading: true
      };
    case TODOS_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        todos: action.result
      };
    case TODOS_LOAD_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case ADD_TODO:
      return {
        ...state,
        loading: true,
        error: null
      };
    case ADD_TODO_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        todos: [
          {
            id: state.todos.length + 1,
            text: action.result
          },
          ...state.todos
        ]
      };
    case ADD_TODO_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
}
