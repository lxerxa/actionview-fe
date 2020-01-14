import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import _ from 'lodash';

import * as KanbanActions from 'redux/actions/KanbanActions';
import * as IssueActions from 'redux/actions/IssueActions';
import * as WorkflowActions from 'redux/actions/WorkflowActions';

const qs = require('qs');
const Header = require('./Header');
const List = require('./List');
const EpicList = require('./epic/List');
const Config = require('./config/Config');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(KanbanActions, dispatch),
    issueActions: bindActionCreators(IssueActions, dispatch),
    wfActions: bindActionCreators(WorkflowActions, dispatch)
  };
}

@DragDropContext(HTML5Backend)
@connect(({ i18n, session, layout, kanban, project, issue, workflow }) => ({ i18n, session, layout, kanban, project, issue, workflow }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.state = { model: 'issue', filter: 'all' };
    this.pid = '';
    this.kanban_id = '';
    this.getOptions = this.getOptions.bind(this);
    this.getList = this.getList.bind(this);
    this.goto = this.goto.bind(this);
    this.gotoBacklog = this.gotoBacklog.bind(this);
    this.gotoIssueList = this.gotoIssueList.bind(this);
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    layout: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    issueActions: PropTypes.object.isRequired,
    wfActions: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    kanban: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    issue: PropTypes.object.isRequired,
    workflow: PropTypes.object.isRequired
  }

  async getList() {
    await this.props.actions.getOptions(this.pid);
    return this.props.kanban.ecode;
  }

  goto(id, model) {
    this.context.router.push({ pathname: '/project/' + this.pid + '/kanban/' + id });
    if (model) {
      this.setState({ model });
    }
  }

  gotoBacklog(epic) {
    this.setState({ model: 'backlog' });
    this.refs.header.handleSelectEV(epic, 'epic');
  }

  gotoIssueList(epic) {
    this.context.router.push({ pathname: '/project/' + this.pid + '/issue', query: { epic } });
  }

  async index(query) {

    if (!this.props.kanban.list || this.props.kanban.list.length <= 0 || !this.kanban_id) {
      return;
    }

    this.refs.list && this.refs.list.closeDetail();

    const newQuery = _.mapValues(query || {}, (v) => { if (_.isArray(v)) { return v.join(','); } else { return v; } });

    const curKanban = _.find(this.props.kanban.list, { id: this.kanban_id }) || {};
    if (curKanban.type === 'kanban') {
      _.extend(newQuery, { from: 'kanban' });
    } else {
      if (this.state.model === 'issue') {
        _.extend(newQuery, { from: 'active_sprint' });
      } else if (this.state.model === 'backlog') {
        _.extend(newQuery, { from: 'backlog' });
      } else if (this.state.model === 'history') {
        _.extend(newQuery, { from: 'his_sprint' });
      } else {
        return;
      }
    }

    newQuery.from_kanban_id = this.kanban_id;
    if (this.state.filter == 'all') {
      newQuery.filter = 'all';
    }
    newQuery.limit = 10000;

    await this.props.issueActions.index(this.pid, qs.stringify(newQuery));
    return this.props.issue.ecode;
  }

  async createKanban(values) {
    await this.props.actions.create(this.pid, values);
    return this.props.kanban.ecode;
  }

  async editKanban(values) {
    await this.props.actions.edit(this.pid, values.id, values);
    return this.props.kanban.ecode;
  }

  async delKanban(id) {
    await this.props.actions.del(this.pid, id);
    if (this.props.kanban.ecode === 0) {
      this.kanban_id = '';
      this.context.router.push({ pathname: '/project/' + this.pid + '/kanban' });
    }
    return this.props.kanban.ecode;
  }

  async create(values) {
    await this.props.issueActions.create(this.pid, values);
    return this.props.issue.ecode;
  }

  async show(id, floatStyle) {
    await this.props.issueActions.show(this.pid, id, floatStyle);
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

  async setProgress(id, values) {
    await this.props.issueActions.setProgress(this.pid, id, values);
    return this.props.issue.ecode;
  }

  async setLabels(id, values) {
    await this.props.issueActions.setLabels(this.pid, id, values);
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
    await this.props.issueActions.indexComments(this.pid, issue_id, this.props.issue.commentsSort);
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
    await this.props.issueActions.indexWorklog(this.pid, issue_id, this.props.issue.worklogSort);
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
    await this.props.issueActions.indexHistory(this.pid, issue_id, this.props.issue.historySort);
    return this.props.issue.ecode;
  }

  async indexGitCommits(issue_id) {
    await this.props.issueActions.indexGitCommits(this.pid, issue_id, this.props.issue.gitCommitsSort);
    return this.props.issue.ecode;
  }

  async doAction(issue_id, workflow_id, values) {
    await this.props.issueActions.doAction(this.pid, issue_id, workflow_id, values || {});
    return this.props.issue.ecode;
  }

  async moveSprintIssue(values, in_sprint) {
    await this.props.actions.moveSprintIssue(this.pid, values);
    if (this.props.kanban.ecode === 0) {
      if (in_sprint) {
        await this.props.issueActions.removeFromSprint(values.issue_no);
      }
    }
    return this.props.kanban.ecode;
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

  async getDraggableActions(id) {
    if (this.state.model == 'backlog') {
      this.props.actions.dragBacklogIssue(id);
    } else {
      await this.props.actions.getDraggableActions(this.pid, id);
      return this.props.kanban.ecode;
    }
  }

  async setRank(values) {
    await this.props.issueActions.setRank(this.pid, this.kanban_id, values);
    return this.props.issue.ecode;
  }

  async release(ids) {
    await this.props.issueActions.release(this.pid, ids);
    return this.props.issue.ecode;
  }

  async getSprint(no) {
    await this.props.actions.getSprint(this.pid, no);
    return this.props.kanban.ecode;
  }

  async createSprint() {
    await this.props.actions.createSprint(this.pid);
    return this.props.kanban.ecode;
  }

  async publishSprint(values, sprintNo) {
    await this.props.actions.publishSprint(this.pid, sprintNo, _.extend(values, { kanban_id: this.kanban_id }));
    if (this.props.kanban.ecode === 0) {
      this.refs.header.changeModel('issue');
    }
    return this.props.kanban.ecode;
  }

  async completeSprint(values, sprintNo) {
    await this.props.actions.completeSprint(this.pid, sprintNo, values);
    if (this.props.kanban.ecode === 0) {
      this.refs.header.changeModel('backlog');
    }
    return this.props.kanban.ecode;
  }

  async deleteSprint(sprintNo) {
    await this.props.actions.deleteSprint(this.pid, sprintNo);
    return this.props.kanban.ecode;
  }

  async getSprintLog(sprintNo) {
    await this.props.actions.getSprintLog(this.pid, this.kanban_id, sprintNo);
    return this.props.kanban.ecode;
  }

  async indexEpic() {
    await this.props.actions.indexEpic(this.pid, this.kanban_id);
    return this.props.kanban.ecode;
  }

  async createEpic(values) {
    await this.props.actions.createEpic(this.pid, values);
    return this.props.kanban.ecode;
  }

  async editEpic(values) {
    await this.props.actions.editEpic(this.pid, values);
    return this.props.kanban.ecode;
  }

  async delEpic(values) {
    await this.props.actions.delEpic(this.pid, values);
    return this.props.kanban.ecode;
  }

  async setEpicSort(values) {
    await this.props.actions.setEpicSort(this.pid, values);
    return this.props.kanban.ecode;
  }

  changeModel(model) {
    this.setState({ model });
  }

  componentWillMount() {
    const { params: { key, id } } = this.props;
    this.pid = key;

    this.getOptions();
    this.getList();
  }

  componentWillReceiveProps(nextProps) {
    const { params: { id }, kanban } = nextProps;

    if (kanban.list.length <= 0) {
      return;
    }

    if (!id) {
      if (this.kanban_id) {
        this.goto(this.kanban_id);
      } else {
        const { list } = kanban;
        list.length > 0 && this.goto(_.head(list).id, 'issue');
      }
    } else {
      if (id != this.kanban_id) {
        this.kanban_id = id;
        this.props.actions.recordAccess(this.pid, id);
      }
    }
  }

  render() {
    if (this.props.project.options) {
      _.assign(this.props.issue.options, this.props.project.options);
      _.assign(this.props.issue.options, { epics: this.props.kanban.epics });
    }

    let curKanban = {};
    if (this.props.issue.options.types && this.kanban_id && this.props.kanban.list.length > 0) {
      curKanban = _.find(this.props.kanban.list, { id: this.kanban_id }) || {};
    }

    return (
      <div style={ { overflowY: 'hidden', height: '100%' } }>
        <Header ref='header' 
          changeModel={ this.changeModel.bind(this) }
          model={ this.state.model }
          curKanban={ curKanban }
          kanbans={ this.props.kanban.list }
          completedSprintNum={ this.props.kanban.completedSprintNum }
          selectedSprint={ this.props.kanban.selectedSprint }
          sprints={ this.props.kanban.sprints }
          versions={ this.props.kanban.versions }
          epics={ this.props.kanban.epics }
          epicLoading={ this.props.kanban.epicLoading }
          indexEpicLoading={ this.props.kanban.indexEpicLoading }
          loading={ this.props.kanban.loading || this.props.issue.optionsLoading }
          getSprintLog={ this.getSprintLog.bind(this) }
          sprintLog={ this.props.kanban.sprintLog }
          sprintLogLoading={ this.props.kanban.sprintLogLoading }
          goto={ this.goto }
          selectedFilter={ this.state.filter }
          selectFilter={ (filter) => { this.setState({ filter }) } }
          index={ this.index.bind(this) } 
          project={ this.props.project.item }
          createKanban={ this.createKanban.bind(this) }
          getSprint={ this.getSprint.bind(this) }
          createSprint={ this.createSprint.bind(this) }
          createEpic={ this.createEpic.bind(this) }
          setEpicSort={ this.setEpicSort.bind(this) }
          create={ this.create.bind(this) }
          addLabels={ this.props.issueActions.addLabels }
          options={ this.props.issue.options }
          i18n={ this.props.i18n }/>
        { (this.state.model == 'issue' || this.state.model == 'backlog' || this.state.model == 'history') &&
        <List ref='list' 
          curKanban={ curKanban }
          selectedSprint={ this.props.kanban.selectedSprint }
          sprints={ this.props.kanban.sprints }
          sprintLoading={ this.props.kanban.sprintLoading }
          selectedFilter={ this.state.filter }
          draggedIssue={ this.props.kanban.draggedIssue }
          draggableActions={ this.props.kanban.wfactions }
          getDraggableActions={ this.getDraggableActions.bind(this) }
          cleanDraggableActions={ this.props.actions.cleanDraggableActions }
          index={ this.index.bind(this) } 
          show={ this.show.bind(this) }
          edit={ this.edit.bind(this) }
          create={ this.create.bind(this) }
          setAssignee={ this.setAssignee.bind(this) }
          setProgress={ this.setProgress.bind(this) }
          setLabels={ this.setLabels.bind(this) }
          addLabels={ this.props.issueActions.addLabels }
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
          sortComments={ this.props.issueActions.sortComments }
          addComments={ this.addComments.bind(this) }
          editComments={ this.editComments.bind(this) }
          delComments={ this.delComments.bind(this) }
          indexWorklog={ this.indexWorklog.bind(this) }
          sortWorklog={ this.props.issueActions.sortWorklog }
          addWorklog={ this.addWorklog.bind(this) }
          editWorklog={ this.editWorklog.bind(this) }
          delWorklog={ this.delWorklog.bind(this) }
          indexHistory={ this.indexHistory.bind(this) }
          sortHistory={ this.props.issueActions.sortHistory }
          indexGitCommits={ this.indexGitCommits.bind(this) }
          sortGitCommits={ this.props.issueActions.sortGitCommits }
          createLink={ this.createLink.bind(this) }
          delLink={ this.delLink.bind(this) }
          doAction={ this.doAction.bind(this) }
          watch={ this.watch.bind(this) }
          copy={ this.copy.bind(this) }
          move={ this.move.bind(this) }
          convert={ this.convert.bind(this) }
          resetState={ this.resetState.bind(this) }
          del={ this.del.bind(this) }
          setRank={ this.setRank.bind(this) }
          release={ this.release.bind(this) }
          moveSprintIssue={ this.moveSprintIssue.bind(this) }
          publishSprint={ this.publishSprint.bind(this) }
          completeSprint={ this.completeSprint.bind(this) }
          deleteSprint={ this.deleteSprint.bind(this) }
          user={ this.props.session.user }
          i18n={ this.props.i18n }
          layout={ this.props.layout }
          model={ this.state.model }
          { ...this.props.issue }/> }
        { this.state.model == 'config' &&
        <Config
          config={ curKanban }
          loading={ this.props.kanban.configLoading }
          edit={ this.editKanban.bind(this) }
          del={ this.delKanban.bind(this) }
          options={ this.props.issue.options }
          i18n={ this.props.i18n } /> }
        { this.state.model == 'epic' &&
        <EpicList
          indexLoading={ this.props.kanban.indexEpicLoading }
          loading={ this.props.kanban.epicLoading }
          collection={ this.props.kanban.epics }
          stateOptions={ this.props.kanban.epicStates }
          selectedItem={ this.props.kanban.selectedEpicItem }
          gotoBacklog={ this.gotoBacklog.bind(this) }
          gotoIssueList={ this.gotoIssueList.bind(this) }
          select={ this.props.actions.selectEpic }
          index={ this.indexEpic.bind(this) }
          create={ this.createEpic.bind(this) }
          update={ this.editEpic.bind(this) }
          del={ this.delEpic.bind(this) }
          options={ this.props.issue.options }
          i18n={ this.props.i18n } /> }
      </div>
    );
  }
}
