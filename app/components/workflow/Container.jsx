import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as WorkflowActions from 'redux/actions/WorkflowActions';

const Header = require('./Header');
const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(WorkflowActions, dispatch)
  };
}

@connect(({ workflow }) => ({ workflow }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.pid = '';
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    workflow: PropTypes.object.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  goConfig(id) {
    const { location: { pathname='' } } = this.props;
    const uri = pathname + '/' + id;
    this.context.router.push({ pathname: uri });
  }

  async index() {
    await this.props.actions.index(this.pid);
    return this.props.workflow.ecode;
  }

  async create(values) {
    await this.props.actions.create(this.pid, values);
    return this.props.workflow.ecode;
  }

  async update(values) {
    await this.props.actions.update(this.pid, values);
    return this.props.workflow.ecode;
  }

  async del(id) {
    const { actions } = this.props;
    await actions.del(this.pid, id);
    return this.props.workflow.ecode;
  }

  async preview(id) {
    await this.props.actions.preview(this.pid, id);
    return this.props.workflow.ecode;
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
    return (
      <div>
        <Header 
          create={ this.create.bind(this) } 
          { ...this.props.workflow }/>
        <List 
          pkey={ this.pid }
          index={ this.index.bind(this) } 
          create={ this.create.bind(this) } 
          select={ this.props.actions.select } 
          update={ this.update.bind(this) } 
          del={ this.del.bind(this) } 
          preview={ this.preview.bind(this) } 
          goConfig={ this.goConfig.bind(this) } 
          delNotify={ this.props.actions.delNotify } 
          { ...this.props.workflow }/>
      </div>
    );
  }
}
