import React, { Component } from 'react';
import { Link } from 'react-router';

class Navbar extends Component {

  render() {
    return (
      <nav className='navbar navbar-default navbar-fixed-top'>
        <div className='container'>
          <div className='navbar-collapse collapse'>
            <ul className='nav navbar-nav'>
              <li>
                <Link to='/'>
                  Todo List
                </Link>
              </li>
              <li>
                <Link to='/users'>
                  User List
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }

}

export default Navbar;
