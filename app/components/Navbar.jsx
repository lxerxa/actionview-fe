import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';

import * as I18nActions from 'redux/actions/I18nActions';
import { getIntlMessage } from 'utils/react-intl-wrapper';

@connect(({ i18n }) => ({ ...i18n }))
class Navbar extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    locale: PropTypes.string,
    messages: PropTypes.object
  }

  i18n = getIntlMessage
  actions = bindActionCreators(I18nActions, this.props.dispatch)

  render() {
    return (
      <nav className='navbar navbar-default navbar-fixed-top'>
        <div className='container'>
          <div className='navbar-collapse collapse'>
            <ul className='nav navbar-nav'>
              <li>
                <Link to='/'>
                  { this.i18n('users') }
                </Link>
              </li>
              <li>
                <Link to='/readme'>
                  { this.i18n('readme') }
                </Link>
              </li>
            </ul>
            <ul className='nav navbar-nav navbar-right'>
              { ['en', 'fr'].map(locale =>
                  <li
                    key={ locale }
                    className={ cx({ active: this.props.locale === locale }) }>
                    <a
                      onClick={ () => this.actions.change(locale) }
                      className='text-uppercase'>
                      { locale }
                    </a>
                  </li>
              ) }
            </ul>
          </div>
        </div>
      </nav>
    );
  }

}

export default Navbar;
