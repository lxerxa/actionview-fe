import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import UserList from './UserList';
import * as UserActions from 'redux/actions/UserActions';

@connect(state => ({ users: state.users }))
class UserContainer extends Component {

  static propTypes = {
    users: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  render() {
    const { users, dispatch } = this.props;
    return (
      <UserList
        users={users}
        actions={bindActionCreators(UserActions, dispatch)} />
    );
  }

}

export default UserContainer;
