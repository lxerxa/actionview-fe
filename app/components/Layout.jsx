import React, { Component, PropTypes } from 'react';
import Navbar from 'components/Navbar';

class Layout extends Component {

  static propTypes = {
    children: PropTypes.element.isRequired
  }

  render() {
    return (
      <div>
        <Navbar />
        <div className='container'>
          { this.props.children }
        </div>
      </div>
    );
  }

}

export default Layout;
