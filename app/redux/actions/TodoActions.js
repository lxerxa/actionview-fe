import {
  ADD_TODO,
  ADD_TODO_SUCCESS,
  ADD_TODO_FAIL,
  TODOS_LOAD,
  TODOS_LOAD_SUCCESS,
  TODOS_LOAD_FAIL
} from '../constants/ActionTypes';

export function addTodo(text) {
  return {
    types: [ADD_TODO, ADD_TODO_SUCCESS, ADD_TODO_FAIL],
    promise: (client) => client.addTodo(text)
  };
}

export function loadTodos() {
  return {
    types: [TODOS_LOAD, TODOS_LOAD_SUCCESS, TODOS_LOAD_FAIL],
    promise: (client) => client.loadTodo()
  };
}
