import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import * as RoleactorActions from 'redux/actions/RoleactorActions';

const Header = require('./Header');
const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(RoleactorActions, dispatch)
  };
}

@connect(({ roleactor }) => ({ roleactor }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.pid = '';
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    roleactor: PropTypes.object.isRequired
  }

  async index() {
    await this.props.actions.index(this.pid);
    return this.props.roleactor.ecode;
  }

  async edit(values) {
    await this.props.actions.edit(this.pid, values);
    return this.props.roleactor.ecode;
  }

  componentWillMount() {
    const { params: { key } } = this.props;
    this.pid = key;
  }

  render() {
    return (
      <div>
        <List index={ this.index.bind(this) } edit={ this.edit.bind(this) } { ...this.props.roleactor }/>
      </div>
    );
  }
}
