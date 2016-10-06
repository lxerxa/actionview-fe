import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button } from 'react-bootstrap';
import * as IssueActions from 'redux/actions/IssueActions';

const Header = require('./Header');
const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(IssueActions, dispatch)
  };
}

@connect(({ issue, project }) => ({ issue, project }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.pid = '';
    this.query = {};
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    issue: PropTypes.object.isRequired
  }

  async index() {
    await this.props.actions.index(this.pid);
    return this.props.issue.ecode;
  }

  async create(values) {
    await this.props.actions.create(this.pid, values);
    return this.props.issue.ecode;
  }

  async edit(values) {
    await this.props.actions.edit(this.pid, values);
    return this.props.issue.ecode;
  }

  async del(id) {
    const { actions } = this.props;
    await actions.del(this.pid, id);
    return this.props.issue.ecode;
  }

  componentWillMount() {
    const { params: { key } } = this.props;
    this.pid = key;
  }
 
  render() {
    if (this.props.issue && this.props.project && this.props.project.options) {
      this.props.issue.options = this.props.project.options;
    }

    const { location: { query={} } } = this.props;

    return (
      <div>
        <Header create={ this.create.bind(this) } { ...this.props.issue }/>
        <List index={ this.index.bind(this) } show={ this.props.actions.show } edit={ this.edit.bind(this) } del={ this.del.bind(this) } delNotify={ this.props.actions.delNotify } { ...this.props.issue } pid={ this.pid } query={ query }/>
      </div>
    );
  }
}
