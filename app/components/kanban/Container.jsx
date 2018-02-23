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
const Config = require('./config/Config');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(KanbanActions, dispatch),
    issueActions: bindActionCreators(IssueActions, dispatch),
    wfActions: bindActionCreators(WorkflowActions, dispatch)
  };
}

@DragDropContext(HTML5Backend)
@connect(({ i18n, session, kanban, project, issue, workflow }) => ({ i18n, session, kanban, project, issue, workflow }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.state = { model: 'issue' };
    this.pid = '';
    this.kanban_id = '';
    this.getOptions = this.getOptions.bind(this);
    this.getList = this.getList.bind(this);
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

  async index(query) {
    await this.props.issueActions.index(this.pid, qs.stringify(_.extend(query || {}, { from: 'kanban', from_kanban_id: this.kanban_id, filter: this.props.kanban.selectedFilter, limit: 10000 })));
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

  async getDraggableActions(id) {
    await this.props.actions.getDraggableActions(this.pid, id);
    return this.props.kanban.ecode;
  }

  async setRank(values) {
    await this.props.issueActions.setRank(this.pid, this.kanban_id, values);
    return this.props.issue.ecode;
  }

  async release(ids) {
    await this.props.issueActions.release(this.pid, ids);
    return this.props.issue.ecode;
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
    }

    let curKanban = {};
    if (this.props.issue.options.types && this.kanban_id && this.props.kanban.list.length > 0) {
      curKanban = _.find(this.props.kanban.list, { id: this.kanban_id }) || {};
    }

    return (
      <div style={ { overflowY: 'hidden', height: 'inherit' } }>
        <Header 
          changeModel={ (model) => { this.setState({ model }) } }
          model={ this.state.model }
          curKanban={ curKanban }
          kanbans={ this.props.kanban.list }
          loading={ this.props.kanban.loading || this.props.issue.optionsLoading }
          goto={ this.goto }
          selectFilter={ this.props.actions.selectFilter }
          index={ this.index.bind(this) } 
          project={ this.props.project.item }
          createKanban={ this.createKanban.bind(this) }
          create={ this.create.bind(this) }
          options={ this.props.issue.options }
          i18n={ this.props.i18n }/>
        { this.state.model == 'issue' &&
        <List 
          curKanban={ curKanban }
          selectedFilter={ this.props.kanban.selectedFilter }
          draggedIssue={ this.props.kanban.draggedIssue }
          draggableActions={ this.props.kanban.wfactions }
          getDraggableActions={ this.getDraggableActions.bind(this) }
          cleanDraggableActions={ this.props.actions.cleanDraggableActions }
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
          setRank={ this.setRank.bind(this) }
          release={ this.release.bind(this) }
          user={ this.props.session.user }
          i18n={ this.props.i18n }
          { ...this.props.issue }/> }
        { this.state.model == 'config' &&
        <Config
          config={ curKanban }
          loading={ this.props.kanban.configLoading }
          edit={ this.editKanban.bind(this) }
          del={ this.delKanban.bind(this) }
          options={ this.props.issue.options }
          i18n={ this.props.i18n } /> }
      </div>
    );
  }
}
