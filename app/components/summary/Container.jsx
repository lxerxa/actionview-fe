import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as SummaryActions from 'redux/actions/SummaryActions';
import * as ProjectActions from 'redux/actions/ProjectActions';
const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(SummaryActions, dispatch),
    projectActions: bindActionCreators(ProjectActions, dispatch)
  };
}

@connect(({ i18n, layout, session, project, summary }) => ({ i18n, layout, session, project, summary }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.pid = '';
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    projectActions: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    layout: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    summary: PropTypes.object.isRequired
  }

  async index() {
    await this.props.actions.index(this.pid);
    return this.props.summary.ecode;
  }

  async archive(id) {
    const { projectActions } = this.props;
    await projectActions.archive(id);
    return this.props.project.ecode;
  }

  async update(id, values) {
    const { projectActions } = this.props;
    await projectActions.update(id, values);
    return this.props.project.ecode;
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
          i18n={ this.props.i18n }
          layout={ this.props.layout }
          index={ this.index.bind(this) } 
          archive={ this.archive.bind(this) }
          update={ this.update.bind(this) }
          project={ this.props.project.item }
          user={ this.props.session.user }
          { ...this.props.summary }/>
      </div>
    );
  }
}
