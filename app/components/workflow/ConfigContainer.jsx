import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as WorkflowActions from 'redux/actions/WfconfigActions';
import { withRouter } from 'react-router';

const Header = require('./ConfigHeader');
const List = require('./ConfigList');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(WorkflowActions, dispatch)
  };
}

@withRouter
@connect(({ wfconfig }) => ({ wfconfig }), mapDispatchToProps)
export default class ConfigContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { isChanged: false };
    this.pid = '';
    this.id = '';
    this.routerWillLeave = this.routerWillLeave.bind(this);
  }


  static propTypes = {
    actions: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
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

  routerWillLeave(nextLocation) {
    if (this.state.isChanged) {
      if (confirm('您修改了流程配置还未保存，确认离开此页面？')) {
        return true; 
      } else {
        return false; 
      }
    }
  }

  componentDidMount() {
    this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave)
  }

  render() {

    //if (this.props.wfconfig && this.props.wfconfig.options && this.props.project && this.props.project.options) {
    //  this.props.wfconfig.options.users = this.props.project.options.users || []; 
    //}

    const { location: { pathname='' } } = this.props;

    return (
      <div>
        <Header 
          setConfigChanged={ (isChanged) => { this.state.isChanged = isChanged } }
          createStep={ this.props.actions.createStep } 
          save={ this.save.bind(this) } 
          cancel={ this.props.actions.cancel } 
          pathname={ pathname }
          { ...this.props.wfconfig }/>
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
