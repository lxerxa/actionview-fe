import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import defaultAvatar from '../assets/images/avatar.png';

@connect(({ mode, session }) => ({ mode, session }))
class Navbar extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    session: PropTypes.object,
    location: PropTypes.object.isRequired,
    mode: PropTypes.string
  }

  render() {
    const { mode = 'day', session = {}, location } = this.props;

    return (
      <div className='navbar-box navbar-skin'>
        <div className='navbar-menu'>
          <Link className={ 'navbar-item logo ' + (location.pathname === '/myproject' && 'active') } title='首页' to='/myproject'>
            <i className='fa fa-bars'></i>
          </Link>
          <Link activeClassName='active' className='navbar-item mobile' title='移动应用' to='/apps'>
            <i className='fa fa-mobile'></i>
          </Link>
        </div>
        <div className='navbar-expanded'>
          <div>
            <a className='navbar-item change-mode'>
              { mode === 'day' ? <i className='fa fa-sun-o'></i> : <i className='fa fa-moon-o'></i> }
            </a>
          </div>
          { session && session.token ?
            <div>
              <a href='#' className='navbar-item expanded-logout' title='登出'>
                <i className='fa fa-sign-out'></i>
              </a>
              <Link to='/settings' className='navbar-item expanded-avatar' title={ session.user.name }>
                <img src={ session.user.avatar } />
              </Link>
            </div>
              :
            <div>
              <Link activeClassName='active' className='navbar-item' title='登录' to='/login'>
                <i className='fa fa-sign-in'></i>
              </Link>
            </div>
          }
        </div>
      </div>
    );
  }

}

export default Navbar;
