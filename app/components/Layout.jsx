import React, { Component, PropTypes } from 'react';

class Layout extends Component {

  static propTypes = {
    children: PropTypes.element.isRequired
  }

  render() {
    return <div>{this.props.children}</div>;
  }

}

export default Layout;
