import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button } from 'react-bootstrap';
import * as WorkflowActions from 'redux/actions/WorkflowActions';

const Header = require('./ConfigHeader');
const List = require('./ConfigList');

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
    this.id = '';
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    workflow: PropTypes.object.isRequired
  }

  async index() {
    await this.props.actions.show(this.pid, this.id);
    return this.props.workflow.ecode;
  }

  async publish(values) {
    await this.props.actions.edit(this.pid, values);
    return this.props.workflow.ecode;
  }

  componentWillMount() {
    const { params: { key, id } } = this.props;
    this.pid = key;
    this.id = id;
  }

  createStep() {
  }

  editStep() {
  }

  delStep() {
  }

  addAction() {
  }

  editActionTriggers() {
  }

  editActionContidions() {
  }

  delAction() {
  }

  render() {
    return (
      <div>
        <Header createStep={ this.createStep.bind(this) } publish={ this.publish.bind(this) } { ...this.props.workflow }/>
        <List index={ this.index.bind(this) } editStep={ this.editStep.bind(this) } delStep={ this.delStep.bind(this) } delStepNotify={ this.props.actions.delStepNotify } addAction={ this.addAction.bind(this) } editActionTriggers={ this.editActionTriggers.bind(this) } editActionContidions={ this.editActionContidions.bind(this) } delAction={ this.delAction.bind(this) } delActionNotify={ this.props.actions.delActionNotify } { ...this.props.workflow }/>
      </div>
    );
  }
}
