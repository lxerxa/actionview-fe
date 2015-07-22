import React, { Component } from 'react';
import { Link } from 'react-router';

class Navbar extends Component {

  render() {
    return (
      <nav>
        <Link to='/'>
          Todo List
        </Link>
        <Link to='/users'>
          User List
        </Link>
      </nav>
    );
  }

}

export default Navbar;
