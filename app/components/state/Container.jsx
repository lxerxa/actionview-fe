import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as StateActions from 'redux/actions/StateActions';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const Header = require('./Header');
const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(StateActions, dispatch)
  };
}

@connect(({ session, project, state }) => ({ session, project, state }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.pid = '';
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired
  }

  async index() {
    await this.props.actions.index(this.pid);
    return this.props.state.ecode;
  }

  async create(values) {
    await this.props.actions.create(this.pid, values);
    return this.props.state.ecode;
  }

  async update(values) {
    await this.props.actions.update(this.pid, values);
    return this.props.state.ecode;
  }

  async del(id) {
    const { actions } = this.props;
    await actions.del(this.pid, id);
    return this.props.state.ecode;
  }

  componentWillMount() {
    const { location: { pathname='' } } = this.props;
    if (/^\/admin\/scheme/.test(pathname)) {
      this.pid = '$_sys_$';
    } else {
      const { params: { key } } = this.props;
      this.pid = key;
    }
  }

  render() {
    const { session, project, location: { pathname='' } } = this.props;

    const isSysConfig = /^\/admin\/scheme/.test(pathname);
    if (isSysConfig) {
      if (_.isEmpty(session.user)) {
        return (<div/>);
      } else if (!session.user.permissions || !session.user.permissions.sys_admin) {
        notify.show('权限不足。', 'warning', 2000);
        return (<div/>);
      }
    } else {
      if (_.isEmpty(project.options)) {
        return (<div/>);
      } else if (!project.options.permissions || project.options.permissions.indexOf('manage_project') === -1) {
        notify.show('权限不足。', 'warning', 2000);
        return (<div/>);
      }
    }

    return (
      <div>
        <Header 
          isSysConfig={ isSysConfig }
          create={ this.create.bind(this) } 
          { ...this.props.state }/>
        <List 
          pkey={ this.pid }
          index={ this.index.bind(this) } 
          select={ this.props.actions.select } 
          update={ this.update.bind(this) } 
          del={ this.del.bind(this) } 
          delNotify={ this.props.actions.delNotify } 
          { ...this.props.state }/>
      </div>
    );
  }
}
