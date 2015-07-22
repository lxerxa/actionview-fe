import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import * as UserActions from 'redux/actions/UserActions';

@connect(({ users }) => ({ users }))
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

    return resolver.resolve(this.actions.index);
  }

  componentWillUnmount() {
    this.actions.clearError();
  }

  renderUser({ name, picture, seed }, index) {
    return (
      <li
        key={index}
        className='text-capitalize'>
        <Link to={ '/users/' + seed }>
          <img
            className='img-thumbnail'
            src={ picture.thumbnail } />
          { name.first } { name.last }
        </Link>
      </li>
    );
  }

  render() {
    const { users } = this.props;
    return (
      <div className='user-list'>
        <h1>Users</h1>
        <ul className='well'>
          {
            users.collection
              .map(this.renderUser)
          }
        </ul>
      </div>
    );
  }

}

export default Users;
