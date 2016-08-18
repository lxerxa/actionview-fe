import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button } from 'react-bootstrap';
import * as WorkflowActions from 'redux/actions/WfconfigActions';

const Header = require('./ConfigHeader');
const List = require('./ConfigList');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(WorkflowActions, dispatch)
  };
}

@connect(({ wfconfig }) => ({ wfconfig }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.pid = '';
    this.id = '';
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    wfconfig: PropTypes.object.isRequired
  }

  async index() {
    await this.props.actions.index(this.pid, this.id);
    return this.props.wfconfig.ecode;
  }

  async publish(values) {
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

  editAction() {
  }

  delAction() {
  }

  render() {
    return (
      <div>
        <Header createStep={ this.createStep.bind(this) } publish={ this.publish.bind(this) } { ...this.props.wfconfig }/>
        <List index={ this.index.bind(this) } editStep={ this.editStep.bind(this) } delStep={ this.delStep.bind(this) } addAction={ this.addAction.bind(this) } editAction={ this.editAction.bind(this) } delAction={ this.delAction.bind(this) } { ...this.props.wfconfig }/>
      </div>
    );
  }
}
