import React, { Component, PropTypes } from 'react';
import TodoItem from './TodoItem';

class TodoList extends Component {

  static propTypes = {
    todos: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  componentWillMount() {
    const { actions } = this.props;
    const { resolver } = this.context.store;

    return resolver.resolve(actions.loadTodos);
  }

  componentWillUpdate({ todos }) {
    if (!todos.error) {
      this.refs.text
        .getDOMNode()
        .value = '';
    }
  }

  handleAddTodo() {
    const { actions } = this.props;
    const text = this.refs.text
      .getDOMNode()
      .value;

    return actions.addTodo(text);
  }

  renderError(error) {
    if (error) {
      return (
        <div>
          <b>Error</b>
          <pre>{JSON.stringify(error, null, 4)}</pre>
        </div>
      );
    }
  }

  renderStatus(loading) {
    if (loading) return <b>Loading...</b>;
  }

  render() {
    const { todos, actions } = this.props;

    return (
      <div>
        <h1>Todo</h1>
        {this.renderError(todos.error)}
        {this.renderStatus(todos.loading)}
        <ul>
          {todos.todos.map(todo =>
            <TodoItem key={todo.id} todo={todo} {...actions} />
          )}
        </ul>
        <textarea ref='text' />
        <button
          onClick={::this.handleAddTodo}>
          Add todo
        </button>
      </div>
    );
  }

}

export default TodoList;
