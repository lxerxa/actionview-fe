import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as VersionActions from 'redux/actions/VersionActions';

const Header = require('./Header');
const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(VersionActions, dispatch)
  };
}

@connect(({ project, version }) => ({ project, version }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.pid = '';
  }

  static propTypes = {
    project: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    version: PropTypes.object.isRequired
  }

  async index() {
    await this.props.actions.index(this.pid);
    return this.props.version.ecode;
  }

  async create(values) {
    await this.props.actions.create(this.pid, values);
    return this.props.version.ecode;
  }

  async update(values) {
    await this.props.actions.update(this.pid, values);
    return this.props.version.ecode;
  }

  async del(id) {
    const { actions } = this.props;
    await actions.del(this.pid, id);
    return this.props.version.ecode;
  }

  componentWillMount() {
    const { params: { key } } = this.props;
    this.pid = key;
  }

  render() {
    const { project: { options={} } } = this.props;

    return (
      <div>
        <Header 
          create={ this.create.bind(this) } 
          options={ options }
          { ...this.props.version }/>
        <List 
          index={ this.index.bind(this) } 
          select={ this.props.actions.select } 
          update={ this.update.bind(this) } 
          del={ this.del.bind(this) } 
          delNotify={ this.props.actions.delNotify } 
          options={ options }
          { ...this.props.version }/>
      </div>
    );
  }
}
