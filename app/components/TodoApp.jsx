import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import MainSection from './MainSection';
import * as TodoActions from '../redux/actions/TodoActions';

@connect(state => ({ todos: state.todos }))
class TodoApp extends Component {

  static propTypes = {
    todos: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  render() {
    const { todos, dispatch } = this.props;
    return (
      <MainSection
        todos={todos}
        actions={bindActionCreators(TodoActions, dispatch)} />
    );
  }

}

export default TodoApp;
