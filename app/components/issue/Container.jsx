import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import * as IssueActions from 'redux/actions/IssueActions';
import * as WorkflowActions from 'redux/actions/WorkflowActions';

const qs = require('qs');
const Header = require('./Header');
const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(IssueActions, dispatch),
    wfActions: bindActionCreators(WorkflowActions, dispatch)
  };
}

@connect(({ i18n, session, layout, issue, project, workflow }) => ({ i18n, session, layout, issue, project, workflow }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.pid = '';
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    wfActions: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    i18n: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    layout: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    workflow: PropTypes.object.isRequired,
    issue: PropTypes.object.isRequired
  }

  refresh(query) {
    const pathname = '/project/' + this.pid + '/issue';
    this.context.router.push({ pathname, query });
  }

  async index(query) {
    this.closeDetailBar();

    if (!query.page) { query.page = 1; }
    await this.props.actions.index(this.pid, qs.stringify(query || {}));
    return this.props.issue.ecode;
  }

  closeDetailBar() {
    this.refs.list && this.refs.list.closeDetail();
  }

  exportExcel(query, fields) {
    const newQuery = _.clone(query);
    newQuery.from = 'export';
    newQuery.export_fields = fields.join(',');
    newQuery.page = 1;
    newQuery.limit = 10000;

    const eleLink = document.createElement('a');
    eleLink.style.display = 'none';
    eleLink.href = '/api/project/' + this.pid + '/issue?' + qs.stringify(newQuery || {});
    eleLink.target = '_blank';
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
  }

  async create(values) {
    await this.props.actions.create(this.pid, values);
    return this.props.issue.ecode;
  }

  async show(id) {
    await this.props.actions.show(this.pid, id);
    return this.props.issue.ecode;
  }

  async getOptions() {
    await this.props.actions.getOptions(this.pid);
    return this.props.issue.ecode;
  }

  async edit(id, values) {
    await this.props.actions.edit(this.pid, id, values);
    return this.props.issue.ecode;
  }

  async del(id) {
    const { actions } = this.props;
    await actions.del(this.pid, id);
    return this.props.issue.ecode;
  }

  async saveFilter(values) {
    await this.props.actions.saveFilter(this.pid, values);
    return this.props.issue.ecode;
  }

  async configFilters(values) {
    await this.props.actions.configFilters(this.pid, values);
    return this.props.issue.ecode;
  }

  async resetFilters() {
    await this.props.actions.resetFilters(this.pid);
    return this.props.issue.ecode;
  }

  async setColumns(values) {
    await this.props.actions.setColumns(this.pid, values);
    return this.props.issue.ecode;
  }

  async resetColumns(values) {
    await this.props.actions.resetColumns(this.pid, values);
    return this.props.issue.ecode;
  }

  async setAssignee(id, values, modalFlag) {
    await this.props.actions.setAssignee(this.pid, id, values, modalFlag);
    return this.props.issue.ecode;
  }

  async setLabels(id, values) {
    await this.props.actions.setLabels(this.pid, id, values);
    return this.props.issue.ecode;
  }

  async delFile(field_key, file_id) {
    await this.props.actions.delFile(this.pid, this.props.issue.itemData.id, field_key, file_id);
    return this.props.issue.ecode;
  }

  async viewWorkflow(definition_id) {
    await this.props.wfActions.preview(this.pid, definition_id);
    return this.props.workflow.ecode;
  }

  async indexComments(issue_id) {
    await this.props.actions.indexComments(this.pid, issue_id, this.props.issue.commentsSort);
    return this.props.issue.ecode;
  }

  async addComments(issue_id, values) {
    await this.props.actions.addComments(this.pid, issue_id, values);
    return this.props.issue.ecode;
  }

  async delComments(issue_id, id) {
    await this.props.actions.delComments(this.pid, issue_id, id);
    return this.props.issue.ecode;
  }

  async editComments(issue_id, id, value) {
    await this.props.actions.editComments(this.pid, issue_id, id, value);
    return this.props.issue.ecode;
  }

  async indexWorklog(issue_id) {
    await this.props.actions.indexWorklog(this.pid, issue_id, this.props.issue.worklogSort);
    return this.props.issue.ecode;
  }

  async addWorklog(issue_id, values) {
    await this.props.actions.addWorklog(this.pid, issue_id, values);
    return this.props.issue.ecode;
  }

  async delWorklog(issue_id, id) {
    await this.props.actions.delWorklog(this.pid, issue_id, id);
    return this.props.issue.ecode;
  }

  async editWorklog(issue_id, id, value) {
    await this.props.actions.editWorklog(this.pid, issue_id, id, value);
    return this.props.issue.ecode;
  }

  async indexHistory(issue_id) {
    await this.props.actions.indexHistory(this.pid, issue_id, this.props.issue.historySort);
    return this.props.issue.ecode;
  }

  async indexGitCommits(issue_id) {
    await this.props.actions.indexGitCommits(this.pid, issue_id, this.props.issue.gitCommitsSort);
    return this.props.issue.ecode;
  }

  async doAction(issue_id, workflow_id, action_id, values, screen) {
    await this.props.actions.doAction(this.pid, issue_id, workflow_id, action_id, values || {}, screen);
    return this.props.issue.ecode;
  }

  async watch(issue_id, flag) {
    await this.props.actions.watch(this.pid, issue_id, flag);
    return this.props.issue.ecode;
  }

  record() {
    this.props.actions.record();
  }

  forward(offset) {
    this.props.actions.forward(offset);
  }

  cleanRecord() {
    this.props.actions.cleanRecord();
  }

  async createLink(values) {
    await this.props.actions.createLink(this.pid, values);
    return this.props.issue.ecode;
  }

  async delLink(id) {
    await this.props.actions.delLink(this.pid, id);
    return this.props.issue.ecode;
  }

  async resetState(id, values) {
    await this.props.actions.resetState(this.pid, id, values);
    return this.props.issue.ecode;
  }

  async convert(id, values) {
    await this.props.actions.convert(this.pid, id, values);
    return this.props.issue.ecode;
  }

  async move(id, values) {
    await this.props.actions.move(this.pid, id, values);
    return this.props.issue.ecode;
  }

  async copy(values) {
    await this.props.actions.copy(this.pid, values);
    return this.props.issue.ecode;
  }

  async imports(values) {
    await this.props.actions.imports(this.pid, values);
    return { ecode: this.props.issue.ecode, emsg: this.props.issue.emsg };
  }

  componentWillMount() {
    const { params: { key } } = this.props;
    this.pid = key;
  }

  render() {
    if (this.props.project.options) {
      _.assign(this.props.issue.options, this.props.project.options);
    }

    const { location: { query={} } } = this.props;

    return (
      <div>
        <Header 
          create={ this.create.bind(this) } 
          addLabels={ this.props.actions.addLabels } 
          saveFilter={ this.saveFilter.bind(this) } 
          resetFilters={ this.resetFilters.bind(this) } 
          setColumns={ this.setColumns.bind(this) } 
          resetColumns={ this.resetColumns.bind(this) } 
          configFilters={ this.configFilters.bind(this) } 
          getOptions={ this.getOptions.bind(this) } 
          query={ query } 
          refresh={ this.refresh.bind(this) } 
          index={ this.index.bind(this) } 
          exportExcel={ this.exportExcel.bind(this) } 
          imports={ this.imports.bind(this) } 
          project={ this.props.project.item } 
          closeDetailBar={ this.closeDetailBar.bind(this) }
          i18n={ this.props.i18n }
          { ...this.props.issue }/>
        <List ref='list' 
          layout={ this.props.layout }
          index={ this.index.bind(this) } 
          show={ this.show.bind(this) } 
          edit={ this.edit.bind(this) } 
          create={ this.create.bind(this) } 
          setAssignee={ this.setAssignee.bind(this) } 
          setLabels={ this.setLabels.bind(this) } 
          addLabels={ this.props.actions.addLabels } 
          delFile={ this.delFile.bind(this) } 
          addFile={ this.props.actions.addFile } 
          record={ this.record.bind(this) } 
          forward={ this.forward.bind(this) } 
          cleanRecord={ this.cleanRecord.bind(this) } 
          del={ this.del.bind(this) } 
          query={ query } 
          refresh={ this.refresh.bind(this) } 
          project={ this.props.project.item } 
          wfCollection={ this.props.workflow.itemSteps || [] } 
          wfLoading={ this.props.workflow.itemLoading } 
          viewWorkflow={ this.viewWorkflow.bind(this) } 
          indexComments={ this.indexComments.bind(this) } 
          sortComments={ this.props.actions.sortComments } 
          addComments={ this.addComments.bind(this) } 
          editComments={ this.editComments.bind(this) } 
          delComments={ this.delComments.bind(this) } 
          indexWorklog={ this.indexWorklog.bind(this) }
          sortWorklog={ this.props.actions.sortWorklog }
          addWorklog={ this.addWorklog.bind(this) }
          editWorklog={ this.editWorklog.bind(this) }
          delWorklog={ this.delWorklog.bind(this) }
          indexHistory={ this.indexHistory.bind(this) }
          sortHistory={ this.props.actions.sortHistory }
          indexGitCommits={ this.indexGitCommits.bind(this) }
          sortGitCommits={ this.props.actions.sortGitCommits }
          createLink={ this.createLink.bind(this) }
          delLink={ this.delLink.bind(this) }
          doAction={ this.doAction.bind(this) }
          watch={ this.watch.bind(this) }
          resetState={ this.resetState.bind(this) }
          copy={ this.copy.bind(this) }
          move={ this.move.bind(this) }
          convert={ this.convert.bind(this) }
          user={ this.props.session.user }
          i18n={ this.props.i18n }
          { ...this.props.issue }/> 
      </div>
    );
  }
}
