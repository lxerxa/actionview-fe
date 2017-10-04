import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import * as KanbanActions from 'redux/actions/KanbanActions';
import * as IssueActions from 'redux/actions/IssueActions';
import * as WorkflowActions from 'redux/actions/WorkflowActions';

const qs = require('qs');
const Header = require('./Header');
const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(KanbanActions, dispatch),
    issueActions: bindActionCreators(IssueActions, dispatch),
    wfActions: bindActionCreators(WorkflowActions, dispatch)
  };
}

@connect(({ i18n, session, kanban, project, issue, workflow }) => ({ i18n, session, kanban, project, issue, workflow }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.pid = '';
    this.kanban_id = '';
    this.getAccess = this.getAccess.bind(this);
    this.setAccess = this.setAccess.bind(this);
    this.goto = this.goto.bind(this);
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    issueActions: PropTypes.object.isRequired,
    wfActions: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    kanban: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    issue: PropTypes.object.isRequired,
    workflow: PropTypes.object.isRequired
  }

  async getAccess() {
    await this.props.actions.getAccess(this.pid);
    return this.props.kanban.ecode;
  }

  setAccess(id) {
    this.props.actions.setAccess(this.pid, id);
  }

  goto(id) {
    this.context.router.push({ pathname: '/project/' + this.pid + '/kanban/' + id });
  }

  async index(query) {
    await this.props.issueActions.index(this.pid, qs.stringify(query || {}));
    return this.props.issue.ecode;
  }

  async create(values) {
    await this.props.issueActions.create(this.pid, values);
    return this.props.issue.ecode;
  }

  async show(id) {
    await this.props.issueActions.show(this.pid, id);
    return this.props.issue.ecode;
  }

  async getOptions() {
    await this.props.issueActions.getOptions(this.pid);
    return this.props.issue.ecode;
  }

  async edit(id, values) {
    await this.props.issueActions.edit(this.pid, id, values);
    return this.props.issue.ecode;
  }

  async setAssignee(id, values) {
    await this.props.issueActions.setAssignee(this.pid, id, values);
    return this.props.issue.ecode;
  }

  async delFile(field_key, file_id) {
    await this.props.issueActions.delFile(this.pid, this.props.issue.itemData.id, field_key, file_id);
    return this.props.issue.ecode;
  }

  async viewWorkflow(definition_id) {
    await this.props.wfActions.preview(this.pid, definition_id);
    return this.props.workflow.ecode;
  }

  async indexComments(issue_id) {
    await this.props.issueActions.indexComments(this.pid, issue_id);
    return this.props.issue.ecode;
  }

  async addComments(issue_id, values) {
    await this.props.issueActions.addComments(this.pid, issue_id, values);
    return this.props.issue.ecode;
  }

  async delComments(issue_id, id) {
    await this.props.issueActions.delComments(this.pid, issue_id, id);
    return this.props.issue.ecode;
  }

  async editComments(issue_id, id, value) {
    await this.props.issueActions.editComments(this.pid, issue_id, id, value);
    return this.props.issue.ecode;
  }

  async indexWorklog(issue_id) {
    await this.props.issueActions.indexWorklog(this.pid, issue_id);
    return this.props.issue.ecode;
  }

  async addWorklog(issue_id, values) {
    await this.props.issueActions.addWorklog(this.pid, issue_id, values);
    return this.props.issue.ecode;
  }

  async delWorklog(issue_id, id) {
    await this.props.issueActions.delWorklog(this.pid, issue_id, id);
    return this.props.issue.ecode;
  }

  async editWorklog(issue_id, id, value) {
    await this.props.issueActions.editWorklog(this.pid, issue_id, id, value);
    return this.props.issue.ecode;
  }

  async indexHistory(issue_id) {
    await this.props.issueActions.indexHistory(this.pid, issue_id);
    return this.props.issue.ecode;
  }

  async doAction(issue_id, workflow_id, action_id, values) {
    await this.props.issueActions.doAction(this.pid, issue_id, workflow_id, action_id, values || {});
    return this.props.issue.ecode;
  }

  watch(issue_id, flag) {
    this.props.issueActions.watch(this.pid, issue_id, flag);
    return this.props.issue.ecode;
  }

  record() {
    this.props.issueActions.record();
  }

  forward(offset) {
    this.props.issueActions.forward(offset);
  }

  cleanRecord() {
    this.props.issueActions.cleanRecord();
  }

  async createLink(values) {
    await this.props.issueActions.createLink(this.pid, values);
    return this.props.issue.ecode;
  }

  async delLink(id) {
    await this.props.issueActions.delLink(this.pid, id);
    return this.props.issue.ecode;
  }

  async resetState(id) {
    await this.props.issueActions.resetState(this.pid, id);
    return this.props.issue.ecode;
  }

  async copy(values) {
    await this.props.issueActions.copy(this.pid, values);
    return this.props.issue.ecode;
  }

  async convert(id, values) {
    await this.props.issueActions.convert(this.pid, id, values);
    return this.props.issue.ecode;
  }

  async move(id, values) {
    await this.props.issueActions.move(this.pid, id, values);
    return this.props.issue.ecode;
  }

  async del(id) {
    await this.props.issueActions.del(this.pid, id);
    return this.props.issue.ecode;
  }

  async componentWillMount() {
    const { params: { key, id } } = this.props;
    this.pid = key;

    const ecode = await this.getAccess();
    if (!id) {
      const { latest_access_id } = this.props.kanban;
      this.goto(latest_access_id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { params: { id } } = nextProps;
    if (!id) {
      if (this.kanban_id) {
        this.goto(this.kanban_id);
      }
    } else {
      if (id != this.kanban_id) {
        this.kanban_id = id;
        this.setAccess(id);
      }
    }
  }

  render() {
    if (this.props.project.options) {
      _.assign(this.props.issue.options, this.props.project.options);
    }

    let current_kanban = {};
    if (this.kanban_id && this.props.kanban.options.kanbans) {
      current_kanban = _.find(this.props.kanban.options.kanbans, { id: this.kanban_id }) || {};
    }

    return (
      <div style={ { overflowY: 'hidden', height: 'inherit' } }>
        <Header 
          current_kanban={ current_kanban }
          kanbans={ this.props.kanban.options.kanbans }
          loading={ this.props.kanban.loading }
          goto={ this.goto }
          index={ this.index.bind(this) } 
          getOptions={ this.getOptions.bind(this) }/>
        <List 
          current_kanban={ current_kanban }
          index={ this.index.bind(this) } 
          show={ this.show.bind(this) }
          edit={ this.edit.bind(this) }
          create={ this.create.bind(this) }
          setAssignee={ this.setAssignee.bind(this) }
          delFile={ this.delFile.bind(this) }
          addFile={ this.props.issueActions.addFile }
          record={ this.record.bind(this) }
          forward={ this.forward.bind(this) }
          cleanRecord={ this.cleanRecord.bind(this) }
          project={ this.props.project.item }
          wfCollection={ this.props.workflow.itemSteps || [] }
          wfLoading={ this.props.workflow.itemLoading }
          viewWorkflow={ this.viewWorkflow.bind(this) }
          indexComments={ this.indexComments.bind(this) }
          addComments={ this.addComments.bind(this) }
          editComments={ this.editComments.bind(this) }
          delComments={ this.delComments.bind(this) }
          indexWorklog={ this.indexWorklog.bind(this) }
          addWorklog={ this.addWorklog.bind(this) }
          editWorklog={ this.editWorklog.bind(this) }
          delWorklog={ this.delWorklog.bind(this) }
          indexHistory={ this.indexHistory.bind(this) }
          createLink={ this.createLink.bind(this) }
          delLink={ this.delLink.bind(this) }
          doAction={ this.doAction.bind(this) }
          watch={ this.watch.bind(this) }
          copy={ this.copy.bind(this) }
          move={ this.move.bind(this) }
          convert={ this.convert.bind(this) }
          resetState={ this.resetState.bind(this) }
          del={ this.del.bind(this) }
          user={ this.props.session.user }
          i18n={ this.props.i18n }
          { ...this.props.issue }/>
      </div>
    );
  }
}
