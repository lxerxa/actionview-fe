import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import * as MemberActions from 'redux/actions/MemberActions';

const Header = require('./Header');
const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(MemberActions, dispatch)
  };
}

@connect(({ member }) => ({ member }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.pid = '';
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    member: PropTypes.object.isRequired
  }

  async index() {
    await this.props.actions.index(this.pid);
    return this.props.member.ecode;
  }

  async edit(values) {
    await this.props.actions.edit(this.pid, values);
    return this.props.member.ecode;
  }

  componentWillMount() {
    const { params: { key } } = this.props;
    this.pid = key;
  }

  render() {
    return (
      <div>
        <List index={ this.index.bind(this) } edit={ this.edit.bind(this) } { ...this.props.member }/>
      </div>
    );
  }
}
