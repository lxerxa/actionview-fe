import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button } from 'react-bootstrap';
import * as FieldActions from 'redux/actions/FieldActions';

const Header = require('./Header');
const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(FieldActions, dispatch)
  };
}

@connect(({ field }) => ({ field }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.pid = '';
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    field: PropTypes.object.isRequired
  }

  async index() {
    await this.props.actions.index(this.pid);
    return this.props.field.ecode;
  }

  async create(values) {
    await this.props.actions.create(this.pid, values);
    return this.props.field.ecode;
  }

  async edit(values) {
    await this.props.actions.edit(this.pid, values);
    return this.props.field.ecode;
  }

  async del(id) {
    const { actions } = this.props;
    await actions.del(this.pid, id);
    return this.props.field.ecode;
  }

  componentWillMount() {
    const { params: { key } } = this.props;
    this.pid = key;
  }

  render() {
    return (
      <div>
        <Header create={ this.create.bind(this) } { ...this.props.field }/>
        <List index={ this.index.bind(this) } show={ this.props.actions.show } edit={ this.edit.bind(this) } del={ this.del.bind(this) } delNotify={ this.props.actions.delNotify } { ...this.props.field }/>
      </div>
    );
  }
}
