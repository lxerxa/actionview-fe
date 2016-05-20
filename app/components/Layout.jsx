import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as SessionActions from 'redux/actions/SessionActions';
import Navbar from 'components/Navbar';

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(SessionActions, dispatch)
  };
}

@connect(({ mode, session }) => ({ mode, session }), mapDispatchToProps)
class Layout extends Component {

  static propTypes = {
    location: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    mode: PropTypes.string,
    session: PropTypes.object,
    children: PropTypes.element
  }

  render() {
    const { location, session, mode, actions } = this.props;
    return (
      <div>
        <Navbar location={ location } mode={ mode } session={ session } logout={ actions.destroy } />
        { this.props.children }
      </div>
    );
  }

}

export default Layout;
