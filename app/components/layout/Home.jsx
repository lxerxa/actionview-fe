import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from './Header';
import Sidebar from './Sidebar';
import { notify } from 'react-notify-toast';
import _ from 'lodash';

import * as ProjectActions from 'redux/actions/ProjectActions';
import * as SessionActions from 'redux/actions/SessionActions';

const qs = require('qs');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ProjectActions, dispatch),
    sessionActions: bindActionCreators(SessionActions, dispatch)
  };
}

@connect(({ project, session }) => ({ project, session }), mapDispatchToProps)
export default class Home extends Component {
  constructor(props) {
    super(props);
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    sessionActions: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired
  }

  async recents() {
    await this.props.actions.recents();
    return this.props.project.ecode;
  }

  async getSess() {
    await this.props.sessionActions.getSess();
    return this.props.session.ecode;
  }

  async logout() {
    await this.props.sessionActions.destroy();
    if (this.props.session.ecode === 0) {
      notify.show('已退出系统。', 'success', 2000);
      this.context.router.push({ pathname: '/login' });
    }
  }

  entry(pathname) {
    this.context.router.push({ pathname });
  }

  componentWillReceiveProps(nextProps) {
    const { session, location: { pathname='', query={} } } = this.props;

    if (nextProps.session.invalid === true) {
      if (session.user.id) {
        notify.show('会话过期，请重新登录。', 'warning', 2000);
      }
      if (pathname) {
        this.context.router.push({ pathname: '/login', query: { request_url: encodeURI(pathname + (!_.isEmpty(query) ? '?' + qs.stringify(query) : '')) } });
      } else {
        this.context.router.push({ pathname: '/login' });
      }
    }
  }

  render() {
    const { location: { pathname='' }, project, session } = this.props;

    return (
      <div className='doc-main'>
        <Header 
          session={ session } 
          project={ project } 
          pathname={ pathname } 
          recents={ this.recents.bind(this) }
          getSess={ this.getSess.bind(this) }
          logout={ this.logout.bind(this) }
          cleanSelectedProject={ this.props.actions.cleanSelectedProject }
          entry={ this.entry.bind(this) }/>
        <Sidebar 
          project={ project } 
          session={ session } 
          pathname={ pathname }/>
        { this.props.children }
      </div>
    );
  }
}
