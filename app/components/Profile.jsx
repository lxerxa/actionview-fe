import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as UserActions from 'redux/actions/UserActions';

@connect(({ users }) => ({ users }))
class Profile extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    users: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired
  }

  static contextTypes = { store: PropTypes.object.isRequired }

  componentWillMount() {
    const { dispatch, params } = this.props;
    const { resolver } = this.context.store;
    this.actions = bindActionCreators(UserActions, dispatch);

    return resolver.resolve(this.actions.show, params.seed);
  }

  componentWillUnmount() {
    this.actions.clearError();
  }

  render() {
    const { params, users: { error, collection } } = this.props;
    const user = collection.find(({ seed }) => seed === params.seed);

    if (error) {
      return (
        <div className='alert alert-danger'>
          <strong>{ error }</strong>
        </div>
      );
    } else if (!user) {
      return (
        <div className='alert alert-danger'>
          <strong>user not found</strong>
        </div>
      );
    } else {
      const { name: { first, last }, picture: { medium } } = user;
      return (
        <div>
          <h1 className='text-capitalize'>{ first } { last }</h1>
          <img className='img-thumbnail' src={ medium } />
        </div>
      );
    }
  }

}

export default Profile;
