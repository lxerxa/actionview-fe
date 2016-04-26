import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

class Navbar extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    session: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    mode: PropTypes.string.isRequired
  }

  render() {
    const { mode = 'day', session = {}, location, logout } = this.props;
    const styles = { fontSize: '16px' };

    return (
      <div className='navbar-box navbar-skin'>
        { session && session.token ?
          <div className='navbar-menu'>
            <Link className={ 'navbar-item ' + (location.pathname !== '/apps' && 'active') } style={ styles } title='项目中心' to='/home'>
              <i className='fa fa-th-large'></i>
            </Link>
            <a href='#' className='navbar-item' style={ styles } title='创建问题'>
              <i className='fa fa-pencil'></i>
            </a>
            <Link activeClassName='active' className='navbar-item mobile' title='移动应用' to='/apps'>
              <i className='fa fa-mobile'></i>
            </Link>
          </div>
          :
          <div className='navbar-menu'>
            <Link className={ 'navbar-item ' + (location.pathname !== '/apps' && 'active') } style={ styles } title='首页' to='/home'>
              <i className='fa fa-th-large'></i>
            </Link>
            <Link activeClassName='active' className='navbar-item mobile' title='移动应用' to='/apps'>
              <i className='fa fa-mobile'></i>
            </Link>
          </div>
        }
        <div className='navbar-expanded'>
          { session && session.token ?
            <div>
              <a href='#' className='navbar-item' title='提醒'>
                <i className='fa fa-bell'></i>
              </a>
              <a href='#' className='navbar-item' title='收藏'>
                <i className='fa fa-bookmark'></i>
              </a>
              <a className='navbar-item change-mode'>
                { mode === 'day' ? <i className='fa fa-sun-o'></i> : <i className='fa fa-moon-o'></i> }
              </a>
              <a href='#' className='navbar-item' title='设置'>
                <i className='fa fa-cogs'></i>
              </a>
              <a href='' onClick={ logout } className='navbar-item expanded-logout' title='登出'>
                <i className='fa fa-sign-out'></i>
              </a>
            </div>
              :
            <div>
              <a className='navbar-item change-mode'>
                { mode === 'day' ? <i className='fa fa-sun-o'></i> : <i className='fa fa-moon-o'></i> }
              </a>
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
