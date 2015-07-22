import React, { Component, PropTypes } from 'react';

class UserList extends Component {

  static propTypes = {
    users: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  componentWillMount() {
    const { actions } = this.props;
    const { resolver } = this.context.store;

    return resolver.resolve(actions.loadUsers);
  }

  render() {
    const { users } = this.props;
    return (
      <ul>
        {users.users.map(({id, name}) =>
          <li key={id}>{id} - {name}</li>
        )}
      </ul>
    );
  }

}

export default UserList;
