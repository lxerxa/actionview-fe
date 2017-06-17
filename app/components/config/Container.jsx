import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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
    return (
      <div>
        <List 
          index={ this.index.bind(this) } 
          project={ this.props.project.item }
          { ...this.props.config }/>
      </div>
    );
  }
}
