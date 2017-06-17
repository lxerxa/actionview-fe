import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

import * as ConfigActions from 'redux/actions/ConfigActions';
const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ConfigActions, dispatch)
  };
}

@connect(({ project, config }) => ({ project, config }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.pid = '';
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired
  }

  async index() {
    await this.props.actions.index(this.pid);
    return this.props.config.ecode;
  }

  componentWillMount() {
    const { actions, params: { key } } = this.props;
    actions.index(key);
    this.pid = key;
  }

  render() {
    const { project } = this.props;

    if (_.isEmpty(project.options) || _.isUndefined(project.options.permissions)) {
      return (<div/>);
    } else if (project.options.permissions.length <= 0) {
      notify.show('权限不足。', 'warning', 2000);
      return (<div/>);
    }

    return (
      <div>
        <List 
          index={ this.index.bind(this) } 
          project={ project.item }
          { ...this.props.config }/>
      </div>
    );
  }
}
