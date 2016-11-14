import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as SessionActions from 'redux/actions/SessionActions';

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(SessionActions, dispatch)
  };
}

@connect(({ session }) => ({ session }), mapDispatchToProps)
class Layout extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    session: PropTypes.object,
    children: PropTypes.element
  }

  render() {
    const { session } = this.props;
    return (
      <div style={ { height: '100%' } }>
        { this.props.children }
      </div>
    );
  }

}

export default Layout;
