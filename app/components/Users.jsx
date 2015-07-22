import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as UserActions from 'redux/actions/UserActions';

@connect(state => ({ users: state.users }))
class Users extends Component {

  static propTypes = {
    users: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  componentWillMount() {
    const { resolver } = this.context.store;
    const { dispatch } = this.props;
    this.actions = bindActionCreators(UserActions, dispatch);

    return resolver.resolve(this.actions.loadUsers);
  }

  renderLoader(loading) {
    if (loading) return <strong>Loading...</strong>;
  }

  renderUser({ id, name }, index) {
    return (
      <li key={index}>
        #{id} - {name}
      </li>
    );
  }

  render() {
    const { users } = this.props;
    return (
      <div>
        <h1>Users</h1>
        {this.renderLoader(users.loading)}
        <ul>
          {
            users.users
              .map(this.renderUser)
          }
        </ul>
      </div>
    );
  }

}

export default Users;
