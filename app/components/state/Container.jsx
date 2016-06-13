import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button } from 'react-bootstrap';
import * as StateActions from 'redux/actions/StateActions';

const Header = require('./Header');
const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(StateActions, dispatch)
  };
}

@connect(({ state }) => ({ state }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.pid = '';
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
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

  async edit(values) {
    await this.props.actions.edit(this.pid, values);
    return this.props.state.ecode;
  }

  async del(id) {
    const { actions } = this.props;
    await actions.del(this.pid, id);
    return this.props.state.ecode;
  }

  async setSort(values) {
    await this.props.actions.setSort(this.pid, values);
    return this.props.state.ecode;
  }

  async setDefault(values) {
    await this.props.actions.setDefault(this.pid, values);
    return this.props.state.ecode;
  }

  componentWillMount() {
    const { params: { key } } = this.props;
    this.pid = key;
  }

  render() {
    return (
      <div>
        <Header setSort={ this.setSort.bind(this) } create={ this.create.bind(this) } { ...this.props.state }/>
        <List index={ this.index.bind(this) } show={ this.props.actions.show } edit={ this.edit.bind(this) } del={ this.del.bind(this) } delNotify={ this.props.actions.delNotify } { ...this.props.state }/>
      </div>
    );
  }
}
