import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from './Header';
import Sidebar from './Sidebar';
import { notify } from 'react-notify-toast';

import * as ProjectActions from 'redux/actions/ProjectActions';

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ProjectActions, dispatch)
  };
}

@connect(({ project, state, session }) => ({ project, state, session }), mapDispatchToProps)
export default class Home extends Component {
  constructor(props) {
    super(props);
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired
  }

  async recents() {
    await this.props.actions.recents();
    return this.props.project.ecode;
  }

  entry(pathname) {
    this.context.router.push({ pathname });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.state.ecode === -10001) {
      notify.show('session失效，请重新登录。', 'warning', 2000);
      this.context.router.push({ pathname: '/login' });
    }
  }

  render() {
    const { location: { pathname='' }, project, session } = this.props;

    return (
      <div className='doc-main'>
        <Header 
          project={ project } 
          pathname={ pathname } 
          recents={ this.recents.bind(this) }
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
