import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ReadmeActions from 'redux/actions/ReadmeActions';

@connect(({ readme }) => ({ readme }))
class Readme extends Component {

  static propTypes = {
    readme: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  componentWillMount() {
    const { dispatch } = this.props;
    const { resolver } = this.context.store;
    this.actions = bindActionCreators(ReadmeActions, dispatch);

    return resolver.resolve(this.actions.load);
  }

  render() {
    const { readme } = this.props;

    if (readme.error) {
      return (
        <div className='alert alert-danger'>
          { readme.error }
        </div>
      );
    } else {
      return (
        <div
          className='well'
          dangerouslySetInnerHTML={{__html: readme.markdown}} />
      );
    }
  }

}

export default Readme;
