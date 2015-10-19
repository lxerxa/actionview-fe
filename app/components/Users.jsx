import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import * as UserActions from 'redux/actions/UserActions';
import connectI18n from 'decorators/connectI18n';

@connect(({ users }) => ({ users }))
@connectI18n()
class Users extends Component {

  static propTypes = {
    users: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = { store: PropTypes.object.isRequired }

  componentWillMount() {
    const { resolver } = this.context.store;
    const { dispatch } = this.props;
    this.actions = bindActionCreators(UserActions, dispatch);

    return resolver.resolve(this.actions.index);
  }

  componentWillUnmount = () => this.actions.clearError()

  render() {
    const { users: { error, collection } } = this.props;
    if (error) {
      return (
        <div className='alert alert-danger'>
          <strong>{ error }</strong>
        </div>
      );
    } else {
      return (
        <div className='user-list'>
          <h1>{ this.i18n('users') }</h1>
          <ul className='well'>
            { collection.map(({ name, picture, seed }) =>
                <li key={ seed }>
                  <Link to={ this.i18n('routes.profile', { seed }) }>
                    <img
                      className='img-thumbnail'
                      src={ picture.thumbnail } />
                    { name.first } { name.last }
                  </Link>
                </li>
            ) }
          </ul>
        </div>
      );
    }
  }

}

export default Users;
