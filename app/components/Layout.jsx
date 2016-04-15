import React, { Component, PropTypes } from 'react';
import Navbar from 'components/Navbar';

class Layout extends Component {

  static propTypes = {
    location: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired
  }

  render() {
    const { location } = this.props;
    return (
      <div>
        <Navbar location={ location }/>
        { this.props.children }
      </div>
    );
  }

}

export default Layout;
