import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import TodoList from './TodoList';
import * as TodoActions from 'redux/actions/TodoActions';

@connect(state => ({ todos: state.todos }))
class TodoContainer extends Component {

  static propTypes = {
    todos: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  render() {
    const { todos, dispatch } = this.props;
    return (
      <TodoList
        todos={todos}
        actions={bindActionCreators(TodoActions, dispatch)} />
    );
  }

}

export default TodoContainer;
