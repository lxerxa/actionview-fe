import React, { PropTypes, Component } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { notify } from 'react-notify-toast';
import _ from 'lodash';

const $ = require('$');
const moment = require('moment');

const loadingImg = require('../../assets/images/loading.gif');
const DetailBar = require('../issue/DetailBar');
const CreateModal = require('../issue/CreateModal');
const Column = require('./Column');
const OverlayColumn = require('./OverlayColumn');
const BacklogOverlayColumn = require('./BacklogOverlayColumn');
const ReleaseVersionModal = require('./ReleaseVersionModal');
const PublishSprintModal = require('./PublishSprintModal');
const DelSprintNotify = require('./DelSprintNotify');
const CompleteSprintNotify = require('./CompleteSprintNotify');
const MoveIssueNotify = require('./MoveIssueNotify');
const ViewSprintModal = require('./ViewSprintModal');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      barShow: false, 
      selectVersionShow: false,
      viewSprintShow: false, 
      publishSprintShow: false,
      completeSprintShow: false,
      deleteSprintShow: false,
      moveIssueShow: false,
      workflowScreenShow: false, 
      movedData: {},
      curSprintNo: 0,
      drop_issue_id: '', 
      action_id: '' 
    };
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    layout: PropTypes.object.isRequired,
    curKanban: PropTypes.object.isRequired,
    selectedSprint: PropTypes.object.isRequired,
    sprints: PropTypes.array.isRequired,
    sprintLoading: PropTypes.bool.isRequired,
    mode: PropTypes.string.isRequired,
    draggedIssue: PropTypes.string.isRequired,
    draggableActions: PropTypes.array.isRequired,
    getDraggableActions: PropTypes.func.isRequired,
    cleanDraggableActions: PropTypes.func.isRequired,
    collection: PropTypes.array.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    wfCollection: PropTypes.array.isRequired,
    wfLoading: PropTypes.bool.isRequired,
    viewWorkflow: PropTypes.func.isRequired,
    indexComments: PropTypes.func.isRequired,
    sortComments: PropTypes.func.isRequired,
    addComments: PropTypes.func.isRequired,
    editComments: PropTypes.func.isRequired,
    delComments: PropTypes.func.isRequired,
    commentsCollection: PropTypes.array.isRequired,
    commentsIndexLoading: PropTypes.bool.isRequired,
    commentsLoading: PropTypes.bool.isRequired,
    commentsItemLoading: PropTypes.bool.isRequired,
    commentsLoaded: PropTypes.bool.isRequired,
    indexWorklog: PropTypes.func.isRequired,
    worklogSort: PropTypes.string.isRequired,
    sortWorklog: PropTypes.func.isRequired,
    addWorklog: PropTypes.func.isRequired,
    editWorklog: PropTypes.func.isRequired,
    delWorklog: PropTypes.func.isRequired,
    worklogCollection: PropTypes.array.isRequired,
    worklogIndexLoading: PropTypes.bool.isRequired,
    worklogLoading: PropTypes.bool.isRequired,
    worklogLoaded: PropTypes.bool.isRequired,
    indexHistory: PropTypes.func.isRequired,
    sortHistory: PropTypes.func.isRequired,
    historyCollection: PropTypes.array.isRequired,
    historyIndexLoading: PropTypes.bool.isRequired,
    historyLoaded: PropTypes.bool.isRequired,
    indexGitCommits: PropTypes.func.isRequired,
    sortGitCommits: PropTypes.func.isRequired,
    gitCommitsCollection: PropTypes.array.isRequired,
    gitCommitsIndexLoading: PropTypes.bool.isRequired,
    gitCommitsLoaded: PropTypes.bool.isRequired,
    itemData: PropTypes.object.isRequired,
    project: PropTypes.object,
    options: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    show: PropTypes.func.isRequired,
    detailFloatStyle: PropTypes.object,
    del: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    copy: PropTypes.func.isRequired,
    move: PropTypes.func.isRequired,
    convert: PropTypes.func.isRequired,
    resetState: PropTypes.func.isRequired,
    setAssignee: PropTypes.func.isRequired,
    setProgress: PropTypes.func.isRequired,
    setLabels: PropTypes.func.isRequired,
    addLabels: PropTypes.func.isRequired,
    fileLoading: PropTypes.bool.isRequired,
    delFile: PropTypes.func.isRequired,
    addFile: PropTypes.func.isRequired,
    record: PropTypes.func.isRequired,
    forward: PropTypes.func.isRequired,
    cleanRecord: PropTypes.func.isRequired,
    visitedIndex: PropTypes.number.isRequired,
    visitedCollection: PropTypes.array.isRequired,
    createLink: PropTypes.func.isRequired,
    delLink: PropTypes.func.isRequired,
    linkLoading: PropTypes.bool.isRequired,
    doAction: PropTypes.func.isRequired,
    watch: PropTypes.func.isRequired,
    selectedFilter: PropTypes.string.isRequired,
    setRank: PropTypes.func.isRequired,
    rankLoading: PropTypes.bool.isRequired,
    release: PropTypes.func.isRequired,
    publishSprint: PropTypes.func.isRequired,
    completeSprint: PropTypes.func.isRequired,
    deleteSprint: PropTypes.func.isRequired,
    moveSprintIssue: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
  }

  selectVersionModalClose() {
    this.setState({ selectVersionShow: false });
  }

  publishSprintModalClose() {
    this.setState({ publishSprintShow: false });
  }

  deleteSprintModalClose() {
    this.setState({ deleteSprintShow: false });
  }

  completeSprintModalClose() {
    this.setState({ completeSprintShow: false });
  }

  moveIssueModalClose() {
    this.setState({ moveIssueShow: false });
  }

  viewSprintModalClose() {
    this.setState({ viewSprintShow: false });
  }

  workflowScreenModalClose() {
    this.setState({ workflowScreenShow: false });
  }

  workflowScreenShow(drop_issue_id, action_id) {
    this.setState({ workflowScreenShow: true, drop_issue_id, action_id });
  }

  async moveSprintIssue(values) {
    const { i18n: { errMsg }, collection, moveSprintIssue } = this.props;
    const { issue_id, src_sprint, dest_sprint } = values;
    const issue = _.find(collection, { id: issue_id });
    const new_values = { issue_no: issue.no, src_sprint_no: src_sprint.no, dest_sprint_no: dest_sprint.no }

    if ((src_sprint && src_sprint.status == 'active') || (dest_sprint && dest_sprint.status == 'active')) {
      this.setState({ moveIssueShow: true, movedData: new_values });
    } else {
      const ecode = await moveSprintIssue(new_values);
      if (ecode !== 0) {
        notify.show('移动失败，' + errMsg[ecode], 'error', 2000);  
      }
    }
  }

  async removeFromSprint(issueNo) {
    const { i18n: { errMsg }, sprints, moveSprintIssue } = this.props;
    const activeSprint = _.find(sprints, { status: 'active' }); 
    if (!_.isEmpty(activeSprint)) {
      const waitingSprint = _.find(sprints, { status: 'waiting' });
      let dest_sprint_no = 0;
      if (waitingSprint) {
        dest_sprint_no = waitingSprint.no;
      }
      const ecode = await moveSprintIssue({ issue_no: issueNo, src_sprint_no: activeSprint.no, dest_sprint_no }, true);
      if (ecode === 0) {
        notify.show('已移出。', 'success', 2000);
      } else {
        notify.show('移出失败，' + errMsg[ecode], 'error', 2000);  
      }
    }
  }

  closeDetail() {
    this.setState({ barShow: false });
    const { cleanRecord } = this.props;
    cleanRecord();
  }

  async issueView(id, colNo) {
    this.setState({ barShow: true });

    const { mode, show, record, curKanban, sprints } = this.props;

    let colNum = 0;
    if (mode == 'backlog') {
      colNum = sprints.length + 1;
    } else if (mode == 'history') {
      colNum = 2;
    } else {
      colNum = curKanban.columns.length;
    }

    let floatStyle = {};
    if (colNo >= _.ceil(colNum / 2)) {
      floatStyle = { left: $('.doc-container').offset().left };
    }

    const ecode = await show(id, floatStyle);
    if (ecode === 0) {
      record();
    }
  }

  componentDidMount() {
    const winHeight = $(window).height(); 
    if ($('#main-header').css('display') == 'none') {
      $('.board-container').css('height', winHeight - 28 - 50);
    } else {
      $('.board-container').css('height', winHeight - 120 - 50);
    }

    $(window).resize(function() { 
      const winHeight = $(window).height(); 
      if ($('#main-header').css('display') == 'none') {
        $('.board-container').css('height', winHeight - 28 - 50);
      } else {
        $('.board-container').css('height', winHeight - 120 - 50);
      }
    });

    $('.board-container').scroll(function() {
      $('.board-zone-overlay').css('top', _.max([ $('.board-container').scrollTop(), 46 ]));
    });
  }

  operateBacklog(eventKey) {
    this.closeDetail();

    const no = eventKey.split('-').pop();
    if (eventKey.indexOf('view') !== -1) {
      this.setState({ viewSprintShow: true, curSprintNo: no - 0 });
    } else if (eventKey.indexOf('publish') !== -1) {
      this.setState({ publishSprintShow: true, curSprintNo: no - 0 });
    } else if (eventKey.indexOf('delete') !== -1) {
      this.setState({ deleteSprintShow: true, curSprintNo: no - 0 });
    }
  }

  render() {
    const { 
      i18n,
      layout,
      curKanban,
      selectedSprint,
      sprints,
      sprintLoading,
      mode,
      draggedIssue,
      draggableActions,
      getDraggableActions,
      cleanDraggableActions,
      collection, 
      indexLoading, 
      wfCollection,
      wfLoading,
      viewWorkflow,
      indexComments,
      sortComments,
      addComments,
      editComments,
      delComments,
      commentsCollection,
      commentsIndexLoading,
      commentsLoading,
      commentsItemLoading,
      commentsLoaded,
      indexWorklog,
      worklogSort,
      sortWorklog,
      addWorklog,
      editWorklog,
      delWorklog,
      worklogCollection,
      worklogIndexLoading,
      worklogLoading,
      worklogLoaded,
      indexHistory,
      sortHistory,
      historyCollection,
      historyIndexLoading,
      historyLoaded,
      indexGitCommits,
      sortGitCommits,
      gitCommitsCollection,
      gitCommitsIndexLoading,
      gitCommitsLoaded,
      itemData,
      project,
      options,
      loading,
      itemLoading,
      show,
      detailFloatStyle,
      edit,
      create,
      setAssignee,
      setProgress,
      setLabels,
      addLabels,
      fileLoading,
      delFile,
      addFile,
      record,
      forward,
      cleanRecord,
      visitedIndex,
      visitedCollection,
      createLink,
      delLink,
      linkLoading,
      watch,
      copy,
      move,
      convert,
      resetState,
      del,
      doAction,
      selectedFilter,
      setRank,
      rankLoading,
      release,
      publishSprint,
      completeSprint,
      deleteSprint,
      moveSprintIssue,
      user
    } = this.props;

    const node = ( <span><i className='fa fa-ellipsis-h'></i></span> );

    let columns = [];
    const columnIssues = [];
    if (!_.isEmpty(curKanban)) {
      if (mode == 'backlog') {
        columns = _.clone(sprints || []);
        columns.unshift({ no: 0, name: 'Backlog' });

        columnIssues[0] = [];
        // classified issue as columns
        _.forEach(sprints, (v, i) => {
          columnIssues[i+1] = [];
        });
        const sprintIssues = [];
        _.forEach(sprints, (v, i) => {
          _.forEach(collection, (v2) => {
            if (!(curKanban.query && curKanban.query.subtask) && v2.parent && v2.parent.id) {
              return;
            }
            if (_.indexOf(v.issues, v2.no) !== -1) {
              columnIssues[i+1].push(v2);
              sprintIssues.push(v2.no);
            }
          });
        });
        _.forEach(collection, (v) => {
          if (!(curKanban.query && curKanban.query.subtask) && v.parent && v.parent.id) {
            return;
          }
          if (_.indexOf(sprintIssues, v.no) === -1) {
            columnIssues[0].push(v);
          }
        });
      } else if (mode == 'history') {
        columns = [ { no: 0, name: '未完成' }, { no: 1, name: '已完成' } ]; 
        columnIssues[0] = [];
        columnIssues[1] = [];
        if (!_.isEmpty(selectedSprint)) {
          _.forEach(collection, (v) => {
            if (!(curKanban.query && curKanban.query.subtask) && v.parent && v.parent.id) {
              return;
            }
            if (_.indexOf(selectedSprint.completed_issues || [], v.no) !== -1) {
              columnIssues[1].push(v);
            } else if (_.indexOf(selectedSprint.incompleted_issues || [], v.no) !== -1) {
              columnIssues[0].push(v);
            }
          });
        }
      } else {
        columns = curKanban.columns || [];
        // classified issue as columns 
        _.forEach(curKanban.columns, (v, i) => {
          columnIssues[i] = [];
        });
        _.forEach(curKanban.columns, (v, i) => {
          _.forEach(collection, (v2) => {
            if (!(curKanban.query && curKanban.query.subtask) && v2.parent && v2.parent.id) {
              return;
            }
            if (_.indexOf(v.states, v2.state) !== -1) {
              columnIssues[i].push(v2);
              return;
            }
          });
        });
      }
    }

    return (
      <div className='board-container'>
        <div className='board-overlay-waiting' style={ { display: !this.state.barShow && itemLoading ? 'block' : 'none' } }>
          <img src={ loadingImg } className='loading board-loading'/>
        </div>

        { !_.isEmpty(curKanban) && indexLoading && 
        <div style={ { marginTop: '20px', width: '100%', textAlign: 'center' } }>
          <img src={ loadingImg } className='loading'/> 
        </div> }

        { !_.isEmpty(curKanban) && !indexLoading && 
        <div className='board-pool'>
          <div className='board-column-header-group'>
            <ul className='board-column-header'>
            { _.map(columns, (v, i) => ( 
              <li 
                key={ i } 
                className='board-column' 
                style={ { background: mode == 'issue' && selectedFilter === 'all' ? (v.max && columnIssues[i].length > v.max ? '#d04437' : (v.min && columnIssues[i].length < v.min ? '#f6c342' : '')) : '' } }>
                <span style={ { fontWeight: 600 } }>
                  { mode == 'backlog' ? (v.no == 0 ? 'Backlog' : 'Sprint ' + v.no) : v.name }
                </span>（{ columnIssues[i].length }）
                { mode == 'issue' && v.max && <span className='config-wip'>{ 'Max-' + v.max }</span> }
                { mode == 'issue' && v.min && <span className='config-wip'>{ 'Min-' + v.min }</span> }
                { mode == 'issue' && curKanban.type == 'kanban' && i == columns.length - 1 && columnIssues[i].length > 0 && selectedFilter == 'all' && options.permissions && options.permissions.indexOf('manage_project') !== -1 &&
                <a href='#' style={ { float: 'right' } } 
                  onClick={ (e) => { e.preventDefault(); this.closeDetail(); this.setState({ selectVersionShow: true }); } }>
                  发布...
                </a> }
                { mode == 'issue' && curKanban.type == 'scrum' && i == columns.length - 1 && selectedFilter == 'all' && options.permissions && options.permissions.indexOf('manage_project') !== -1 && _.findIndex(sprints, { status: 'active' }) !== -1 &&
                <a href='#' style={ { float: 'right' } } 
                  onClick={ (e) => { e.preventDefault(); this.closeDetail(); this.setState({ completeSprintShow: true }); } }>
                  完成...
                </a> }
                { mode == 'backlog' && options.permissions && options.permissions.indexOf('manage_project') !== -1 && i != 0 &&
                <div style={ { float: 'right' } }>
                  <DropdownButton
                    bsStyle='default'
                    title={ node }
                    noCaret
                    style={ { padding: '2px 7px' } }
                    onSelect={ this.operateBacklog.bind(this) }
                    onClick={ this.closeDetail.bind(this) }
                    pullRight>
                    <MenuItem disabled={ columnIssues[i].length <= 0 } eventKey={ 'view-' +  v.no }>工作量查看</MenuItem> 
                    { v.status == 'waiting' && i == 1 && <MenuItem disabled={ columnIssues[i].length <= 0 } eventKey={ 'publish-' +  v.no }>启动</MenuItem> }
                    { v.status == 'waiting' && <MenuItem eventKey={ 'delete-' + v.no }>删除</MenuItem> }
                  </DropdownButton> 
                </div> }
                { mode == 'backlog' && v.status == 'active' && <span> - <b>活动中</b></span> }
              </li> ) ) }
            </ul>
          </div>
          <div className='board-columns'>
          { _.map(columns, (v, i) => {
            return (
              <Column 
                key={ i }
                colNo={ i }
                displayFields={ curKanban.display_fields || [] }
                epicShow={ mode == 'backlog' || mode == 'history' }
                inSprint={ mode == 'issue' && curKanban.type == 'scrum' }
                inHisSprint={ mode == 'history' }
                subtaskShow={ curKanban.query && curKanban.query.subtask && true }
                openedIssue={ this.state.barShow ? itemData : {} }
                draggedIssue={ _.find(collection, { id: draggedIssue }) || {} }
                issueView={ this.issueView.bind(this) }
                getDraggableActions={ getDraggableActions }
                cleanDraggableActions={ cleanDraggableActions }
                setRank={ setRank }
                rankLoading={ rankLoading }
                cards={ columnIssues[i] }
                pkey={ project.key }
                closeDetail={ this.closeDetail.bind(this) }
                removeFromSprint={ this.removeFromSprint.bind(this) }
                options={ options } /> ) } ) }
          </div>
          { mode == 'issue' &&
          <div className='board-zone-overlay' style={ { top: '46px' } }>
            <div className='board-zone-overlay-table'>
            { _.map(columns, (v, i) => {
              return (
                <OverlayColumn
                  key={ i }
                  columns={ columns }
                  isEmpty={ !(draggedIssue && _.findIndex(columnIssues[i], { id: draggedIssue }) === -1) }
                  draggedIssue={ _.find(collection, { id: draggedIssue }) || {} }
                  draggableActions={ draggableActions }
                  doAction={ doAction }
                  workflowScreenShow={ this.workflowScreenShow.bind(this) }
                  options={ options }
                  acceptStates={ v.states || [] }/> ) } ) }
            </div>
          </div> }
          { mode == 'backlog' && options.permissions && options.permissions.indexOf('manage_project') !== -1 &&
          <div className='board-zone-overlay' style={ { top: '46px' } }>
            <div className='board-zone-overlay-table'>
            { _.map(columns, (v, i) => {
              return (
                <BacklogOverlayColumn
                  key={ i }
                  sprintNo={ v.no }
                  columns={ columns }
                  isEmpty={ !(draggedIssue && _.findIndex(columnIssues[i], { id: draggedIssue }) === -1 && options.permissions && options.permissions.indexOf('manage_project') !== -1) }
                  draggedIssue={ _.find(collection, { id: draggedIssue }) || {} }
                  moveSprintIssue={ this.moveSprintIssue.bind(this) }
                  options={ options }/> ) } ) }
            </div>
          </div> }
        </div> }
        { !_.isEmpty(curKanban) && !indexLoading && mode == 'issue' && curKanban.type == 'scrum' && _.findIndex(sprints, { status: 'active' }) === -1 && collection.length <= 0 &&
        <div style={ { marginTop: '20px', width: '100%', textAlign: 'center' } }>
          <span>暂无活动的Sprint</span>
        </div> }
        { this.state.barShow &&
          <DetailBar
            i18n={ i18n }
            layout={ layout }
            edit={ edit }
            create={ create }
            del={ del }
            setAssignee={ setAssignee }
            setProgress={ setProgress }
            setLabels={ setLabels }
            addLabels={ addLabels }
            close={ this.closeDetail.bind(this) }
            options={ options }
            data={ itemData }
            record={ record }
            forward={ forward }
            visitedIndex={ visitedIndex }
            visitedCollection={ visitedCollection }
            issueCollection={ [] }
            show = { show }
            detailFloatStyle={ detailFloatStyle }
            itemLoading={ itemLoading }
            loading={ loading }
            fileLoading={ fileLoading }
            project={ project }
            delFile={ delFile }
            addFile={ addFile }
            wfCollection={ wfCollection }
            wfLoading={ wfLoading }
            viewWorkflow={ viewWorkflow }
            indexComments={ indexComments }
            sortComments={ sortComments }
            commentsCollection={ commentsCollection }
            commentsIndexLoading={ commentsIndexLoading }
            commentsLoading={ commentsLoading }
            commentsItemLoading={ commentsItemLoading }
            commentsLoaded={ commentsLoaded }
            addComments={ addComments }
            editComments={ editComments }
            delComments={ delComments }
            indexWorklog={ indexWorklog }
            worklogSort={ worklogSort }
            sortWorklog={ sortWorklog }
            worklogCollection={ worklogCollection }
            worklogIndexLoading={ worklogIndexLoading }
            worklogLoading={ worklogLoading }
            worklogLoaded={ worklogLoaded }
            addWorklog={ addWorklog }
            editWorklog={ editWorklog }
            delWorklog={ delWorklog }
            indexHistory={ indexHistory }
            sortHistory={ sortHistory }
            historyCollection={ historyCollection }
            historyIndexLoading={ historyIndexLoading }
            historyLoaded={ historyLoaded }
            indexGitCommits={ indexGitCommits }
            sortGitCommits={ sortGitCommits }
            gitCommitsCollection={ gitCommitsCollection }
            gitCommitsIndexLoading={ gitCommitsIndexLoading }
            gitCommitsLoaded={ gitCommitsLoaded }
            linkLoading={ linkLoading }
            createLink={ createLink }
            delLink={ delLink }
            watch={ watch }
            copy={ copy }
            move={ move }
            convert={ convert }
            resetState={ resetState }
            doAction={ doAction }
            user={ user }/> }
        { this.state.workflowScreenShow &&
          <CreateModal show
            close={ this.workflowScreenModalClose.bind(this) }
            options={ options }
            edit={ edit }
            loading={ loading }
            project={ project }
            data={ _.extend(_.find(collection, { id: this.state.drop_issue_id }), { wfactions: draggableActions }) }
            action_id={ this.state.action_id  }
            doAction={ doAction }
            isFromWorkflow={ true }
            i18n={ i18n }/> }
        { this.state.selectVersionShow &&
          <ReleaseVersionModal show
            options={ options }
            close={ this.selectVersionModalClose.bind(this) }
            release={ release } 
            releasedIssues={ _.last(columnIssues) || [] } 
            i18n={ i18n }/> }
        { this.state.publishSprintShow &&
          <PublishSprintModal show
            close={ this.publishSprintModalClose.bind(this) }
            sprintNo={ this.state.curSprintNo }
            publish={ publishSprint }
            i18n={ i18n }/> }
        { this.state.deleteSprintShow &&
          <DelSprintNotify show
            close={ this.deleteSprintModalClose.bind(this) }
            sprintNo={ this.state.curSprintNo }
            del={ deleteSprint }
            loading={ sprintLoading }
            i18n={ i18n }/> }
        { this.state.completeSprintShow &&
          <CompleteSprintNotify show
            close={ this.completeSprintModalClose.bind(this) }
            loading={ sprintLoading }
            sprintNo={ _.find(sprints, { status: 'active' }) ? _.find(sprints, { status: 'active' }).no : 0 }
            total={ _.flatten(columnIssues).length }
            complete={ completeSprint }
            completedIssues={ _.last(columnIssues) || [] }
            i18n={ i18n }/> }
        { this.state.moveIssueShow &&
          <MoveIssueNotify show
            close={ this.moveIssueModalClose.bind(this) }
            loading={ sprintLoading }
            move={ moveSprintIssue }
            values={ this.state.movedData }
            i18n={ i18n }/> }
        { this.state.viewSprintShow &&
          <ViewSprintModal show
            close={ this.viewSprintModalClose.bind(this) }
            sprintNo={ this.state.curSprintNo }
            sprints={ sprints }
            collection={ collection }/> }
      </div>
    );
  }
}
