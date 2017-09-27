import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, Label, DropdownButton, MenuItem, ButtonGroup, Nav, NavItem } from 'react-bootstrap';
import Person from '../share/Person';
import _ from 'lodash';

const moment = require('moment');
const no_avatar = require('../../assets/images/no_avatar.png');
const img = require('../../assets/images/loading.gif');
const DetailBar = require('../issue/DetailBar');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { limit: 30, category: 'all', barShow: false, hoverRowId: '' };
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    collection: PropTypes.array.isRequired,
    increaseCollection: PropTypes.array.isRequired,
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
    user: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index } = this.props;
    index({ limit: this.state.limit });
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

  render() {
    const { 
      i18n,
      collection, 
      increaseCollection, 
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
      user
    } = this.props;


    return (
      <div className='board-container'>
        <div className='board-pool'>
          <div className='board-column-header-group'>
            <ul className='board-column-header'>
              <li className='board-column'>待处理（13）</li>
              <li className='board-column'>进行中（10）</li>
              <li className='board-column'>已完成（3）</li>
            </ul>
          </div>
        </div>
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
