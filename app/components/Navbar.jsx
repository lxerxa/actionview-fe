import React, { Component } from 'react';
import { Link } from 'react-router';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import defaultAvatar from '../assets/images/avatar.png';

@connect(({ styleMode }) => ({ styleMode }))
class Navbar extends Component {
  render() {
    return (
      <div className='navbar-box navbar-skin'>
        <div className='navbar-menu'>
          <Link className='navbar-item logo' title='首页' to='/'>
            Hu
          </Link>
          <Link activeClassName='active' className='navbar-item mobile hidden-xs' title='移动应用' to='/apps'>
            <i className='fa fa-mobile'></i>
          </Link>
        </div>
      </div>
    );
  }

}

export default Navbar;
