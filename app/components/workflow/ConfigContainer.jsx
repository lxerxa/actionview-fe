import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as WorkflowActions from 'redux/actions/WfconfigActions';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const Header = require('./ConfigHeader');
const List = require('./ConfigList');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(WorkflowActions, dispatch)
  };
}

@connect(({ session, project, wfconfig }) => ({ session, project, wfconfig }), mapDispatchToProps)
export default class ConfigContainer extends Component {
  constructor(props) {
    super(props);
    this.pid = '';
    this.id = '';
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    wfconfig: PropTypes.object.isRequired
  }

  async index() {
    await this.props.actions.index(this.pid, this.id);
    return this.props.wfconfig.ecode;
  }

  async save(values) {
    await this.props.actions.save(this.pid, this.id, values);
    return this.props.wfconfig.ecode;
  }

  componentWillMount() {
    const { location: { pathname='' } } = this.props;
    if (/^\/admin\/scheme/.test(pathname)) {
      this.pid = '$_sys_$';
    } else {
      const { params: { key } } = this.props;
      this.pid = key;
    }
    const { params: { id } } = this.props;
    this.id = id;
  }

  render() {
    const { session, project, wfconfig, location: { pathname='' } } = this.props;

    const isSysConfig = /^\/admin\/scheme/.test(pathname);
    if (isSysConfig) {
      if (_.isEmpty(session.user)) {
        return (<div/>);
      } else if (!session.user.permissions || !session.user.permissions.sys_admin) {
        notify.show('权限不足。', 'warning', 2000);
        return (<div/>);
      }
    } else {
      if (_.isEmpty(project.options) || _.isUndefined(project.options.permissions)) {
        return (<div/>);
      } else if (_.indexOf(project.options.permissions, 'manage_project') === -1) {
        notify.show('权限不足。', 'warning', 2000);
        return (<div/>);
      }
    }

    return (
      <div>
        { wfconfig.collection.length > 0 &&
        <Header 
          createStep={ this.props.actions.createStep } 
          save={ this.save.bind(this) } 
          pathname={ pathname }
          { ...this.props.wfconfig }/> }
        <List 
          index={ this.index.bind(this) } 
          editStep={ this.props.actions.editStep } 
          delStep={ this.props.actions.delStep } 
          addAction={ this.props.actions.addAction } 
          editAction={ this.props.actions.editAction } 
          delAction={ this.props.actions.delAction } 
          { ...this.props.wfconfig }/>
      </div>
    );
  }
}
