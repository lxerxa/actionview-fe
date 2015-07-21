import React, { Component, PropTypes } from 'react';

class TodoItem extends Component {

  static propTypes = {
    todo: PropTypes.object.isRequired
  }

  render() {
    const { todo } = this.props;
    return <li>{todo.text}</li>;
  }

}

export default TodoItem;
