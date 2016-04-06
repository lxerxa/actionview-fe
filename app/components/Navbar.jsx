import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import defaultAvatar from '../assets/images/avatar.png'

import * as ReadmeActions from 'redux/actions/ReadmeActions';

@connect(({ readme }) => ({ readme }))
class Readme extends Component {

  static propTypes = {
    readme: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = { store: PropTypes.object.isRequired }

  componentWillMount() {
    const { dispatch } = this.props;
    const { resolver } = this.context.store;
    this.actions = bindActionCreators(ReadmeActions, dispatch);

    return resolver.resolve(this.actions.load);
  }

  render() {
    const { readme: { error, markdown } } = this.props;
    if (error) return <div className='alert alert-danger'>{ error }</div>;

    return (
      <div
        className='well'
        dangerouslySetInnerHTML={ { __html: markdown } } />
    );
  }

}

export default Readme;
