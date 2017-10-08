import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, Label, DropdownButton, MenuItem, ButtonGroup, Nav, NavItem } from 'react-bootstrap';
import _ from 'lodash';

const $ = require('$');
const moment = require('moment');
const img = require('../../assets/images/loading.gif');
const DetailBar = require('../issue/DetailBar');
const Card = require('./Card');
const Column = require('./Column');
const OverlayColumn = require('./OverlayColumn');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { limit: 30, category: 'all', barShow: false, hoverRowId: '' };
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    curKanban: PropTypes.object.isRequired,
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
    setRank: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
  }

  componentWillMount() {
    //const { index } = this.props;
    //index({ limit: this.state.limit });
  }

  refresh() {
    const { index } = this.props;
    index({ category: this.state.category, limit: this.state.limit });
  }

  closeDetail() {
    this.setState({ barShow: false });
    const { cleanRecord } = this.props;
    cleanRecord();
  }

  async issueView(id) {
    this.setState({ barShow: true });
    const { show, record } = this.props;
    const ecode = await show(id);
    if (ecode === 0) {
      record();
    }
  }

  componentDidMount() {
    const winHeight = $(window).height(); 
    $('.board-container').css('height', winHeight - 170);

    $(window).resize(function() { 
      const winHeight = $(window).height(); 
      $('.board-container').css('height', winHeight - 170);
    });

    $('.board-container').scroll(function() {
      $('.board-zone-overlay').css('top', _.max([ $('.board-container').scrollTop(), 46 ]));
    });
  }

  render() {
    const { 
      i18n,
      curKanban,
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
      setRank,
      user
    } = this.props;

    const sortedCollection = _.sortByOrder(collection, [ 'rank' ]);
    const columnIssues = [];
    _.forEach(curKanban.columns, (v, i) => {
      columnIssues[i] = [];
    });

    _.forEach(curKanban.columns, (v, i) => {
      _.forEach(sortedCollection, (v2) => {
        if (_.findIndex(v.states, { id: v2.state }) !== -1) {
          columnIssues[i].push(v2);
          return;
        }
      });
    });

    return (
      <div className='board-container'>
      { !_.isEmpty(curKanban) && indexLoading && 
        <div style={ { marginTop: '20px', width: '100%', textAlign: 'center' } }>
         <img src={ img } className='loading'/> 
        </div> }

      { !_.isEmpty(curKanban) && !indexLoading && 
        <div className='board-pool'>
          <div className='board-column-header-group'>
            <ul className='board-column-header'>
            { _.map(curKanban.columns, (v, i) => ( <li key={ i } className='board-column'>{ v.name }（{ columnIssues[i].length }）</li> ) ) }
            </ul>
          </div>
          <ul className='board-columns'>
          { _.map(curKanban.columns, (v, i) => {
            return (
              <Column 
                key={ i }
                getDraggableActions={ getDraggableActions }
                cleanDraggableActions={ cleanDraggableActions }
                setRank={ setRank }
                cards={ columnIssues[i] }
                pkey={ project.key }
                acceptTypes={ _.map(v.states || [], (v) => v.id ) }
                options={ options } /> ) } ) }
          </ul>
          <div className='board-zone-overlay' style={ { top: '46px' } }>
            <div className='board-zone-overlay-table'>
            { _.map(curKanban.columns, (v, i) => {
              return (
                <OverlayColumn 
                  key={ i }
                  index={ i }
                  isEmpty={ draggedIssue && _.findIndex(columnIssues[i], { id: draggedIssue }) === -1 ? false : true }
                  draggableActions={ draggableActions }
                  states={ v.states || [] }/> ) } ) }
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
