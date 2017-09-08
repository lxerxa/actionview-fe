import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import * as RoleActions from 'redux/actions/RoleActions';

const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(RoleActions, dispatch)
  };
}

@connect(({ project, role }) => ({ project, role }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.pid = '';
  }

  static propTypes = {
    project: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    role: PropTypes.object.isRequired
  }

  async index() {
    await this.props.actions.teamIndex(this.pid);
    return this.props.role.ecode;
  }

  async setActor(values) {
    await this.props.actions.setActor(this.pid, values);
    return this.props.role.ecode;
  }

  async setGroupActor(values) {
    await this.props.actions.setGroupActor(this.pid, values);
    return this.props.role.ecode;
  }

  componentWillMount() {
    const { params: { key } } = this.props;
    this.pid = key;
  }

  render() {
    if (this.props.project.options) {
      _.assign(this.props.role.options, this.props.project.options);
    }

    return (
      <div>
        <List 
          index={ this.index.bind(this) } 
          setActor={ this.setActor.bind(this) } 
          setGroupActor={ this.setGroupActor.bind(this) } 
          { ...this.props.role }/>
      </div>
    );
  }
}
