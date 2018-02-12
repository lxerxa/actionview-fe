import React, { PropTypes, Component } from 'react';
import _ from 'lodash';

const $ = require('$');
const moment = require('moment');

const loadingImg = require('../../../assets/images/loading.gif');
const DetailBar = require('../../issue/DetailBar');
const CreateModal = require('../../issue/CreateModal');
const Column = require('./Column');
const OverlayColumn = require('./OverlayColumn');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      barShow: false, 
      drop_issue_id: '', 
      action_id: '' };
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    curKanban: PropTypes.object.isRequired,
    rankLoading: PropTypes.bool.isRequired,
    draggedIssue: PropTypes.string.isRequired,
    collection: PropTypes.array.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    wfCollection: PropTypes.array.isRequired,
    wfLoading: PropTypes.bool.isRequired,
    viewWorkflow: PropTypes.func.isRequired,
    indexComments: PropTypes.func.isRequired,
    addComments: PropTypes.func.isRequired,
    editComments: PropTypes.func.isRequired,
    delComments: PropTypes.func.isRequired,
    commentsCollection: PropTypes.array.isRequired,
    commentsIndexLoading: PropTypes.bool.isRequired,
    commentsLoading: PropTypes.bool.isRequired,
    commentsItemLoading: PropTypes.bool.isRequired,
    commentsLoaded: PropTypes.bool.isRequired,
    indexWorklog: PropTypes.func.isRequired,
    addWorklog: PropTypes.func.isRequired,
    editWorklog: PropTypes.func.isRequired,
    delWorklog: PropTypes.func.isRequired,
    worklogCollection: PropTypes.array.isRequired,
    worklogIndexLoading: PropTypes.bool.isRequired,
    worklogLoading: PropTypes.bool.isRequired,
    worklogLoaded: PropTypes.bool.isRequired,
    indexHistory: PropTypes.func.isRequired,
    historyCollection: PropTypes.array.isRequired,
    historyIndexLoading: PropTypes.bool.isRequired,
    historyLoaded: PropTypes.bool.isRequired,
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
    rankable: PropTypes.bool.isRequired,
    setRank: PropTypes.func.isRequired,
    release: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
  }

  closeDetail() {
    this.setState({ barShow: false });
    const { cleanRecord } = this.props;
    cleanRecord();
  }

  async issueView(id, colNo) {
    this.setState({ barShow: true });

    const { show, record, curKanban } = this.props;
    const colNum = curKanban.columns.length;
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

  render() {
    const { 
      i18n,
      curKanban,
      rankLoading,
      draggedIssue,
      collection, 
      indexLoading, 
      wfCollection,
      wfLoading,
      viewWorkflow,
      indexComments,
      addComments,
      editComments,
      delComments,
      commentsCollection,
      commentsIndexLoading,
      commentsLoading,
      commentsItemLoading,
      commentsLoaded,
      indexWorklog,
      addWorklog,
      editWorklog,
      delWorklog,
      worklogCollection,
      worklogIndexLoading,
      worklogLoading,
      worklogLoaded,
      indexHistory,
      historyCollection,
      historyIndexLoading,
      historyLoaded,
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
      rankable,
      setRank,
      release,
      user
    } = this.props;

    const columnIssues = [];
    if (!_.isEmpty(curKanban)) {
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

    return (
      <div className='board-container'>
        <div className='board-overlay-waiting' style={ { display: !this.state.barShow && itemLoading ? 'block' : 'none' } }>
          <img src={ loadingImg } className='loading board-loading'/>
        </div>
        { !_.isEmpty(curKanban) && (rankLoading || indexLoading) && 
        <div style={ { marginTop: '20px', width: '100%', textAlign: 'center' } }>
          <img src={ loadingImg } className='loading'/> 
        </div> }

        { !_.isEmpty(curKanban) && !indexLoading && !rankLoading && 
        <div className='board-pool'>
          <div className='board-column-header-group'>
            <ul className='board-column-header'>
            { _.map(curKanban.columns, (v, i) => ( 
              <li key={ i } className='board-column'>
                <span style={ { fontWeight: 600 } }>{ v.name }</span>（{ columnIssues[i].length }）
                { i == curKanban.columns.length - 1 && columnIssues[i].length > 0 && 
                <a href='#' style={ { float: 'right' } }> 
                  发布...
                </a> }
              </li> ) ) }
            </ul>
          </div>
          <div className='board-columns'>
          { _.map(curKanban.columns, (v, i) => {
            return (
              <Column 
                key={ i }
                colNo={ i }
                rankMap={ curKanban.ranks || [] }
                subtaskShow={ curKanban.query && curKanban.query.subtask && true }
                openedIssue={ this.state.barShow ? itemData : {} }
                draggedIssue={ _.find(collection, { id: draggedIssue }) || {} }
                issueView={ this.issueView.bind(this) }
                setRank={ setRank }
                cards={ columnIssues[i] }
                pkey={ project.key }
                accepts={ v.states }
                closeDetail={ this.closeDetail.bind(this) }
                options={ options } /> ) } ) }
          </div>
          <div className='board-zone-overlay' style={ { top: '46px' } }>
            <div className='board-zone-overlay-table'>
            { _.map(curKanban.columns, (v, i) => {
              return (
                <OverlayColumn
                  key={ i }
                  index={ i }
                  isEmpty={ !(draggedIssue && _.findIndex(columnIssues[i], { id: draggedIssue }) === -1) }
                  draggedIssue={ _.find(collection, { id: draggedIssue }) || {} }
                  options={ options }
                  acceptStates={ v.states || [] }/> ) } ) }
            </div>
          </div>
        </div> }
        { this.state.barShow &&
          <DetailBar
            i18n={ i18n }
            edit={ edit }
            create={ create }
            del={ del }
            setAssignee={ setAssignee }
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
            commentsCollection={ commentsCollection }
            commentsIndexLoading={ commentsIndexLoading }
            commentsLoading={ commentsLoading }
            commentsItemLoading={ commentsItemLoading }
            commentsLoaded={ commentsLoaded }
            addComments={ addComments }
            editComments={ editComments }
            delComments={ delComments }
            indexWorklog={ indexWorklog }
            worklogCollection={ worklogCollection }
            worklogIndexLoading={ worklogIndexLoading }
            worklogLoading={ worklogLoading }
            worklogLoaded={ worklogLoaded }
            addWorklog={ addWorklog }
            editWorklog={ editWorklog }
            delWorklog={ delWorklog }
            indexHistory={ indexHistory }
            historyCollection={ historyCollection }
            historyIndexLoading={ historyIndexLoading }
            historyLoaded={ historyLoaded }
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
      </div>
    );
  }
}
