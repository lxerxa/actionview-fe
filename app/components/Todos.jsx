import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as TodoActions from 'redux/actions/TodoActions';

@connect(state => ({ todos: state.todos }))
class Todos extends Component {

  static propTypes = {
    todos: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  componentWillMount() {
    const { resolver } = this.context.store;
    const { dispatch } = this.props;
    this.actions = bindActionCreators(TodoActions, dispatch);

    return resolver.resolve(this.actions.loadTodos);
  }

  renderTodoItem({ id, text }, index) {
    return (
      <div className='well' key={index}>
        #{id} - {text}
      </div>
    );
  }

  render() {
    const { todos } = this.props;

    return (
      <div>
        <h1>Todo List</h1>
        {
          todos.todos
            .map(this.renderTodoItem)
        }
      </div>
    );
  }

}

export default Todos;
