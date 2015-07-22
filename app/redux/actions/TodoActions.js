import { asyncFuncCreator } from '../utils';

export function addTodo(text) {
  return asyncFuncCreator({
    CONSTANT: 'TODO_ADD',
    promise: (client) => client.addTodo(text)
  });
}

export function loadTodos() {
  return asyncFuncCreator({
    CONSTANT: 'TODOS_LOAD',
    promise: (client) => client.loadTodos()
  });
}
