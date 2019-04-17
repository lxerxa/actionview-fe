import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as SummaryActions from 'redux/actions/SummaryActions';
const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(SummaryActions, dispatch)
  };
}

@connect(({ layout, project, summary }) => ({ layout, project, summary }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.pid = '';
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    layout: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    summary: PropTypes.object.isRequired
  }

  async index() {
    await this.props.actions.index(this.pid);
    return this.props.summary.ecode;
  }

  componentWillMount() {
    const { actions, params: { key } } = this.props;
    actions.index(key);
    this.pid = key;
  }

  componentWillReceiveProps(nextProps) {
    const { actions } = this.props;
    const { params: { key } } = nextProps;
    if (key !== this.pid) {
      actions.index(key);
      this.pid = key;
    }
  }

  render() {
    return (
      <div>
        <List 
          layout={ this.props.layout }
          index={ this.index.bind(this) } 
          project={ this.props.project.item }
          { ...this.props.summary }/>
      </div>
    );
  }
}
