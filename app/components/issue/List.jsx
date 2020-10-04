import React, { PropTypes, Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, DropdownButton, MenuItem, Label, Nav, NavItem } from 'react-bootstrap';
import { Link } from 'react-router';
import _ from 'lodash';
import { notify } from 'react-notify-toast';
import { DetailMinWidth, DetailMaxWidth } from '../share/Constants';

const $ = require('$');
const moment = require('moment');
const DelNotify = require('./DelNotify');
const DetailBar = require('./DetailBar');
const img = require('../../assets/images/loading.gif');
const PaginationList = require('../share/PaginationList');
const AddWorklogModal = require('./worklog/AddWorklogModal');
const CreateModal = require('./CreateModal');
const ConvertTypeModal = require('./ConvertTypeModal');
const ConvertType2Modal = require('./ConvertType2Modal');
const MoveModal = require('./MoveModal');
const AssignModal = require('./AssignModal');
const SetLabelsModal = require('./SetLabelsModal');
const ShareLinkModal = require('./ShareLinkModal');
const ResetStateModal = require('./ResetStateModal');
const CopyModal = require('./CopyModal');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      delNotifyShow: false, 
      operateShow: false, 
      detailBarShow: false,
      addWorklogShow: false,
      editModalShow: false,
      createSubtaskModalShow: false,
      convertTypeModalShow: false,
      convertType2ModalShow: false,
      moveModalShow: false,
      assignModalShow: false,
      setLabelsModalShow: false,
      shareModalShow: false,
      resetModalShow: false,
      copyModalShow: false,
      selectedItem: {},
      hoverRowId: '',
      display_columns: []
    };

    this.delNotifyClose = this.delNotifyClose.bind(this);
    this.closeDetail = this.closeDetail.bind(this);
    this.show = this.show.bind(this);
    this.watch = this.watch.bind(this);
    this.getLabelStyle = this.getLabelStyle.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    layout: PropTypes.object.isRequired,
    collection: PropTypes.array.isRequired,
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
    indexLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
    query: PropTypes.object,
    show: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
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
    copy: PropTypes.func.isRequired,
    move: PropTypes.func.isRequired,
    convert: PropTypes.func.isRequired,
    resetState: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    selectedIds: PropTypes.array.isRequired,
    setSelectedIds: PropTypes.func.isRequired,
    isBatchHandle: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired
  }

  async componentWillMount() {
    const { index, query={} } = this.props;
    let ecode = await index(query);
    if (ecode === 0 && query.no) {
      const { collection, show, record } = this.props;
      if (collection.length > 0) {
        this.state.detailBarShow = true;
        ecode = await show(collection[0].id); 
        if (ecode === 0) {
          record();
        }
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const newQuery = nextProps.query || {};
    const { index, query } = this.props;
    if (!_.isEqual(newQuery, query)) {
      index(newQuery);
    }
  }

  delNotifyClose() {
    this.setState({ delNotifyShow: false });
  }

  async operateSelect(eventKey) {
    const { watch, collection } = this.props;

    const { hoverRowId } = this.state;
    const selectedItem = _.find(collection, { id: hoverRowId }) || {}; 
    this.setState({ selectedItem });

    let ecode = 0;
    if (eventKey === 'view') {
      this.show(hoverRowId); 
    } else if (eventKey === 'del') {
      this.setState({ delNotifyShow : true });
    } else if (eventKey === 'assign') {
      this.setState({ assignModalShow : true });
    } else if (eventKey === 'setLabels') {
      this.setState({ setLabelsModalShow : true });
    } else if (eventKey === 'worklog') {
      this.setState({ addWorklogShow : true });
    } else if (eventKey === 'edit') {
      this.setState({ editModalShow : true });
    } else if (eventKey === 'createSubtask') {
      this.setState({ createSubtaskModalShow : true });
    } else if (eventKey === 'convert2Subtask') {
      this.setState({ convertType2ModalShow : true });
    } else if (eventKey === 'convert2Standard') {
      this.setState({ convertTypeModalShow : true });
    } else if (eventKey === 'move') {
      this.setState({ moveModalShow : true });
    } else if (eventKey === 'share') {
      this.setState({ shareModalShow : true });
    } else if (eventKey === 'reset') {
      this.setState({ resetModalShow : true });
    } else if (eventKey === 'copy') {
      this.setState({ copyModalShow : true });
    } else if (eventKey === 'watch') {
      this.watch(selectedItem.id, !selectedItem.watching);
    } else {
      // todo err notify
    }
  }

  async watch(id, flag) {
    const { watch } = this.props;
    const ecode = await watch(id, flag);
    if (ecode === 0) {
      if (flag) {
        notify.show('关注成功。', 'success', 2000);
      } else {
        notify.show('已取消关注。', 'success', 2000);
      }
    } else {
      if (flag) {
        notify.show('关注失败。', 'error', 2000);
      } else {
        notify.show('取消失败。', 'error', 2000);
      }
    }
  }

  onRowMouseOver(rowData) {
    if (rowData.id !== this.state.hoverRowId) {
      this.setState({ operateShow: true, hoverRowId: rowData.id });
    }
  }

  onMouseLeave() {
    this.setState({ operateShow: false, hoverRowId: '' });
  }

  onSelectAll(isSelected, rows) {
    const { selectedIds, setSelectedIds } = this.props;
    if (isSelected) {
      const length = rows.length;
      for (let i = 0; i < length; i++) {
        selectedIds.push(rows[i].id);
      }
      setSelectedIds(selectedIds);
    } else {
      setSelectedIds([]);
    }
  }

  onSelect(row, isSelected) {
    const { selectedIds, setSelectedIds } = this.props;
    if (isSelected) {
      selectedIds.push(row.id);
    } else {
      const index = selectedIds.indexOf(row.id);
      if (index !== -1) {
        selectedIds.splice(index, 1);
      }
    }
    setSelectedIds(selectedIds);
  }

  orderBy(field) {
    const { query={}, refresh } = this.props;
    if (_.isEmpty(query) || !query.orderBy) {
      refresh(_.assign(query, { orderBy: field + ' asc', page: undefined }));
      return;
    }

    const newOrders = [];
    const orders = query.orderBy.toLowerCase().split(',');
    const ind = _.findIndex(orders, (val) => { return _.startsWith(_.trim(val), field) });
    if (ind === -1) {
      newOrders.push(field + ' asc');
    } else {
      newOrders.push(field + (_.endsWith(orders[ind], 'desc') ? ' asc' : ' desc'));
    }
    _.map(orders, (val, i) => {
      if (ind === i) {
        return;
      }
      newOrders.push(val);
    });

    refresh(_.assign(query, { orderBy: newOrders.join(','), page: undefined })); 
  }

  async show(id) {
    this.setState({ detailBarShow: true }); 
    const { show, record } = this.props;
    const ecode = await show(id);  //fix me
    if (ecode == 0) {
      record();
    }
  }

  componentDidUpdate() {
    const { itemData={} } = this.props;

    let idNo = 0;
    let titleNo = 3;
    if ($('.react-bs-table-container th').eq(3).attr('data-field') !== 'title') {
      idNo = 1;
      titleNo = 4;
    }

    if (this.state.detailBarShow) {
      $('.react-bs-container-body table tr').each(function(i) {
        if (itemData.id === $(this).find('td').eq(idNo).text()) {
          $(this).css('background-color', '#e6f7ff');
        } else {
          $(this).css('background-color', '');
        }
      });
    } else {
      $('.react-bs-container-body table tr').each(function(i) {
        $(this).css('background-color', '');
      });
    }

    if (parseInt($('.react-bs-table-container th').eq(titleNo).css('width')) < 300) {
      $('.react-bs-table-container th').eq(titleNo).css('width', '300px');
      $('.react-bs-table-container th').eq(titleNo).css('min-width', '300px');
      $('.react-bs-table-container col').eq(titleNo).css('width', '300px');
      $('.react-bs-table-container col').eq(titleNo).css('min-width', '300px');
    }
  }

  closeDetail() {
    const { layout } = this.props;
    const width = _.min([ _.max([ layout.containerWidth / 2, DetailMinWidth ]), DetailMaxWidth ]);
    const animateStyles = { right: -width };
    $('.animate-dialog').animate(animateStyles);

    setTimeout(() => {
      this.setState({ detailBarShow: false });
    }, 300);

    const { cleanRecord } = this.props;
    cleanRecord();
  }

  getLabelStyle(name) {
    const { options: { labels=[] } } = this.props;
    const label = _.find(labels, { name }); 

    let style = {};
    if (label && label.bgColor) {
      style = {
        backgroundColor: label.bgColor,
        borderColor: label.bgColor,
        border: '1px solid ' + label.bgColor,
        color: '#fff'
      };
    }
    return style;
  }

  render() {
    const { 
      i18n,
      layout,
      collection, 
      itemData={}, 
      loading, 
      indexLoading, 
      itemLoading, 
      options={}, 
      show, 
      record, 
      forward,
      visitedIndex,
      visitedCollection, 
      del, 
      edit, 
      create, 
      setAssignee, 
      setProgress, 
      setLabels, 
      addLabels, 
      query, 
      refresh, 
      project, 
      delFile, 
      addFile, 
      fileLoading, 
      wfCollection, 
      wfLoading, 
      viewWorkflow, 
      indexComments, 
      sortComments, 
      commentsCollection, 
      commentsIndexLoading, 
      commentsLoading, 
      commentsLoaded, 
      addComments, 
      editComments, 
      delComments, 
      commentsItemLoading, 
      indexWorklog, 
      worklogSort, 
      sortWorklog, 
      worklogCollection, 
      worklogIndexLoading, 
      worklogLoading, 
      worklogLoaded, 
      addWorklog, 
      editWorklog, 
      delWorklog, 
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
      createLink, 
      delLink, 
      linkLoading, 
      watch, 
      copy,
      move,
      convert,
      resetState,
      selectedIds,
      isBatchHandle,
      doAction,
      user 
    } = this.props;

    const { operateShow, hoverRowId, selectedItem } = this.state;
    const node = ( <span><i className='fa fa-cog'></i></span> );

    const textStyle = { whiteSpace: 'pre-wrap', overflowWrap: 'break-word' };

    const display_columns = [];
    _.forEach(options.display_columns || [], (v) => {
      const field = _.find(options.fields || [], { key: v.key });
      if (!field || field.type == 'File') {
        return;
      }

      const newField = _.clone(field);
      newField.width = v.width || '100';
      newField.sortKey = field.key;
      if ([ 'MultiVersion', 'MultiSelect', 'MultiUser', 'CheckboxGroup' ].indexOf(field.type) !== -1) {
        newField.sortKey = '';
      } else if (field.type === 'TimeTracking') {
        newField.sortKey = field.key + '_m';
      } 

      display_columns.push(newField);
    });

    const mainOrder = {};
    if (!_.isEmpty(query) && query.orderBy) {
      let strFirstOrder = _.trim(query.orderBy.toLowerCase()).split(',').shift();
      let tmp = strFirstOrder.split(' ');
      mainOrder.field = tmp[0];
      mainOrder.order = _.trim(tmp[1] || 'asc');
    }

    const subtaskTypeOptions = [];
    _.map(options.types, (val) => {
      if (val.type == 'subtask' && !val.disabled) {
        subtaskTypeOptions.push(val);
      }
    });

    let selectRow = { selected: selectedIds };
    if (isBatchHandle) {
      selectRow = {
        mode: 'checkbox',
        selected: selectedIds,
        onSelect: this.onSelect.bind(this),
        onSelectAll: this.onSelectAll.bind(this)
      };
    }

    const issues = [];
    _.forEach(collection, (item) => {
      const issue = {};
      issue.id = item.id;
      issue.type = (
        <span className='type-abb' title={ _.findIndex(options.types, { id: item.type }) !== -1 ? _.find(options.types, { id: item.type }).name : '' }>
          { _.findIndex(options.types, { id: item.type }) !== -1 ? _.find(options.types, { id: item.type }).abb : '-' }
        </span> );
      issue.no = ( <a href='#' onClick={ (e) => { e.preventDefault(); e.stopPropagation(); this.show(item.id) } }>{ item.no }</a> );
      issue.title = ( 
        <div>
          { item.parent &&
          <span style={ { whiteSpace: 'pre-wrap', wordWrap: 'break-word' } }>
            { item.parent.title ? item.parent.title + ' / ' : '- / ' }
          </span> }
          <a href='#' onClick={ (e) => { e.preventDefault(); e.stopPropagation(); this.show(item.id) } } style={ { whiteSpace: 'pre-wrap', wordWrap: 'break-word' } }>
            { item.title ? item.title : '-' }
          </a>
          { item.watching &&
          <span title='点击取消关注' style={ { marginLeft: '8px', color: '#FF9900', cursor: 'pointer' } } onClick={ () => { this.watch(item.id, false) } }><i className='fa fa-eye'></i></span> }
          <span className='table-td-issue-desc'>
            { item.reporter &&
            <span style={ { marginRight: '7px', marginTop: '2px', float: 'left' } }>
              { item.reporter.name + '  ' + moment.unix(item.created_at).format('YYYY/MM/DD HH:mm') }
            </span> }
            { _.map(item.labels || [], 
              (val, i) => 
                <Link to={ '/project/' + project.key + '/issue?labels=' + val } key={ i }>
                  <span title={ val } className='issue-label' style={ this.getLabelStyle(val) }>
                    { val }
                  </span>
                </Link>
              ) }
          </span>
        </div> );
      issue.operation = (
        <div>
          { operateShow && hoverRowId === item.id && !itemLoading &&
            <DropdownButton
              id={ item.id }
              pullRight
              bsStyle='link'
              style={ { textDecoration: 'blink' ,color: '#000' } }
              title={ node }
              onSelect={ this.operateSelect.bind(this) }>
              <MenuItem eventKey='view'>查看</MenuItem>
              { options.permissions && options.permissions.indexOf('edit_issue') !== -1 && <MenuItem eventKey='edit'>编辑</MenuItem> }
              { options.permissions && options.permissions.indexOf('assign_issue') !== -1 && <MenuItem eventKey='assign'>分配</MenuItem> }
              { options.permissions && options.permissions.indexOf('edit_issue') !== -1 && <MenuItem eventKey='setLabels'>设置标签</MenuItem> }
              <MenuItem divider/>
              <MenuItem eventKey='watch'>{ item.watching ? '取消关注' : '关注' }</MenuItem>
              <MenuItem eventKey='share'>分享链接</MenuItem>
              <MenuItem divider/>
              <MenuItem eventKey='worklog'>添加工作日志</MenuItem>
              { !item.parent_id && subtaskTypeOptions.length > 0 && options.permissions && (options.permissions.indexOf('create_issue') !== -1 || (options.permissions.indexOf('edit_issue') !== -1 && !item.hasSubtasks)) && <MenuItem divider/> }
              { !item.parent_id && subtaskTypeOptions.length > 0 && options.permissions && options.permissions.indexOf('create_issue') !== -1 && <MenuItem eventKey='createSubtask'>创建子任务</MenuItem> }
              { !item.hasSubtasks && !item.parent_id && subtaskTypeOptions.length > 0 && options.permissions && options.permissions.indexOf('edit_issue') !== -1 && <MenuItem eventKey='convert2Subtask'>转换为子任务</MenuItem> }
              { item.parent_id && options.permissions && options.permissions.indexOf('edit_issue') !== -1 && <MenuItem divider/> }
              { item.parent_id && options.permissions && options.permissions.indexOf('edit_issue') !== -1 && <MenuItem eventKey='convert2Standard'>转换为标准问题</MenuItem> }
              { options.permissions && (options.permissions.indexOf('create_issue') !== -1 || (options.permissions.indexOf('move_issue') !== -1 && item.parent_id)) && <MenuItem divider/> }
              { options.permissions && options.permissions.indexOf('move_issue') !== -1 && item.parent_id && <MenuItem eventKey='move'>移动</MenuItem> }
              { options.permissions && options.permissions.indexOf('create_issue') !== -1 && <MenuItem eventKey='copy'>复制</MenuItem> }
              { options.permissions && _.intersection(options.permissions, ['reset_issue', 'delete_issue']).length > 0 && <MenuItem divider/> }
              { options.permissions && options.permissions.indexOf('reset_issue') !== -1 && <MenuItem eventKey='reset'>重置状态</MenuItem> }
              { options.permissions && options.permissions.indexOf('delete_issue') !== -1 && <MenuItem eventKey='del'>删除</MenuItem> }
            </DropdownButton> }
          </div> );

      _.forEach(display_columns, (val) => {
        if (!item[val.key] && !_.isNumber(item[val.key])) {
          issue[val.key] = '-';
          return;
        }
        if (val.key === 'priority') {
          const priorityInd = _.findIndex(options.priorities, { id: item.priority });
          const priorityStyle = { marginLeft: '14px' };
          if (priorityInd !== -1) {
            priorityStyle.backgroundColor = options.priorities[priorityInd].color;
          }
          issue.priority = priorityInd !== -1 ? <div className='circle' style={ priorityStyle } title={ options.priorities[priorityInd].name }/> : <div style={ priorityStyle }>-</div>;
        } else if (val.key === 'state') {
          const stateInd = _.findIndex(options.states, { id: item.state });
          let stateClassName = '';
          if (stateInd !== -1) {
            stateClassName = 'state-' + (options.states[stateInd].category || '') + '-label';
          }
          issue.state = stateInd !== -1 ? <span className={ stateClassName }>{ options.states[stateInd].name || '-' }</span> : '-';
        } else if (val.type === 'TextArea') {
          const contents = item[val.key] ? _.escape(item[val.key]).replace(/(\r\n)|(\n)/g, '<br/>') : '-';
          issue[val.key] = <span style={ textStyle } dangerouslySetInnerHTML={ { __html: contents } }/>;
        } else {
          let contents = '';
          if (val.key === 'sprints') {
            contents = item['sprints'] && item['sprints'].length > 0 ? item['sprints'].join(',') : '-'; 
          } else if (val.type === 'SingleUser') {
            contents = item[val.key].name; 
          } else if (val.type === 'MultiUser') {
            contents = _.map(item[val.key], (v) => v.name).join(','); 
          } else if ([ 'Select', 'RadioGroup', 'SingleVersion' ].indexOf(val.type) !== -1) {
            contents = _.findIndex(val.optionValues || [], { id: item[val.key] }) === -1 ? '-' : _.find(val.optionValues, { id: item[val.key] }).name;
          } else if ([ 'MultiSelect', 'CheckboxGroup', 'MultiVersion' ].indexOf(val.type) !== -1) {
            const ids = !_.isArray(item[val.key]) ? item[val.key].split(',') : item[val.key];
            const names = []; 
            _.forEach(ids, (id) => {
              const tmp = _.findIndex(val.optionValues || [], { id }) !== -1 ? _.find(val.optionValues, { id }).name : '';
              if (tmp) {
                names.push(tmp);
              }
            });
            contents = names.length > 0 ? _.uniq(names).join(',') : '-';
          } else if (val.type === 'DatePicker') {
            contents = moment.unix(item[val.key]).format('YYYY/MM/DD');
          } else if (val.type === 'DateTimePicker') {
            contents = moment.unix(item[val.key]).format('YYYY/MM/DD HH:mm');
          } else {
            contents = item[val.key] + (val.key == 'progress' ? '%' : '');
          }
          issue[val.key] = <span style={ textStyle }>{ contents }</span>;
        }
      });
      issues.push(issue);
    });

    const opts = {};
    if (indexLoading) {
      opts.noDataText = ( <div><img src={ img } className='loading'/></div> );
    } else {
      opts.noDataText = '暂无数据显示。'; 
    } 

    opts.onRowMouseOver = this.onRowMouseOver.bind(this);
    // opts.onMouseLeave = this.onMouseLeave.bind(this);

    return (
      <div>
        <BootstrapTable 
          hover
          data={ issues } 
          bordered={ false } 
          options={ opts } 
          selectRow={ selectRow }
          trClassName='tr-top' 
          headerStyle={ { overflow: 'unset' } }>
          <TableHeaderColumn dataField='id' hidden isKey>ID</TableHeaderColumn>
          <TableHeaderColumn width='50' dataField='type'> 
            <span className='table-header' onClick={ this.orderBy.bind(this, 'type') } title='类型'>
              <span style={ { marginRight: '3px' } }>类型</span>
              { mainOrder.field === 'type' && 
                (mainOrder.order === 'desc' ? <i className='fa fa-caret-down'></i> : <i className='fa fa-caret-up'></i>) }
            </span>
          </TableHeaderColumn>
          <TableHeaderColumn dataField='no' width='50' title='NO'>
            <span className='table-header' onClick={ this.orderBy.bind(this, 'no') }>
              <span style={ { marginRight: '3px' } }>NO</span>
              { mainOrder.field === 'no' && 
                (mainOrder.order === 'desc' ? <i className='fa fa-caret-down'></i> : <i className='fa fa-caret-up'></i>) }
            </span>
          </TableHeaderColumn>
          <TableHeaderColumn dataField='title'>
            <span className='table-header' onClick={ this.orderBy.bind(this, 'title') } title='主题'>
              <span style={ { marginRight: '3px' } }>主题</span>
              { mainOrder.field === 'title' && 
                (mainOrder.order === 'desc' ? <i className='fa fa-caret-down'></i> : <i className='fa fa-caret-up'></i>) }
            </span>
          </TableHeaderColumn>
          { _.map(display_columns, (val, i) => {
            return (
              <TableHeaderColumn width={ val.width || '100' } dataField={ val.key } key={ i }>
                <span className='table-header' onClick={ val.sortKey ? this.orderBy.bind(this, val.sortKey) : null } title={ val.name }>
                  <span style={ { marginRight: '3px' } }>{ val.name }</span>
                  { mainOrder.field === val.sortKey && 
                    (mainOrder.order === 'desc' ? <i className='fa fa-caret-down'></i> : <i className='fa fa-caret-up'></i>) }
                </span>
              </TableHeaderColumn>);
          }) }
          <TableHeaderColumn width='60' dataField='operation'/>
        </BootstrapTable>
        { this.state.detailBarShow &&
          <DetailBar 
            i18n={ i18n }
            layout={ layout }
            create={ create } 
            edit={ edit } 
            del={ del } 
            setAssignee={ setAssignee } 
            setProgress={ setProgress } 
            setLabels={ setLabels } 
            addLabels={ addLabels } 
            close={ this.closeDetail } 
            options={ options } 
            data={ itemData } 
            record={ record }
            forward={ forward }
            visitedIndex={ visitedIndex }
            visitedCollection={ visitedCollection }
            issueCollection={ collection } 
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
        { !indexLoading && options.total && options.total > 0 ? 
          <PaginationList 
            total={ options.total || 0 } 
            curPage={ query.page ? (query.page - 0) : 1 } 
            sizePerPage={ options.sizePerPage || 50 } 
            paginationSize={ 4 } 
            query={ query } 
            refresh={ refresh }/> 
          : '' }
        { this.state.delNotifyShow && 
          <DelNotify show 
            close={ this.delNotifyClose } 
            data={ selectedItem } 
            loading = { itemLoading }
            del={ del }
            i18n={ i18n }/> }
        { this.state.addWorklogShow &&
          <AddWorklogModal show
            issue={ selectedItem }
            close={ () => { this.setState({ addWorklogShow: false }) } }
            loading = { worklogLoading }
            add={ addWorklog }
            i18n={ i18n }/> }
        { this.state.editModalShow && 
          <CreateModal show 
            close={ () => { this.setState({ editModalShow: false }); } } 
            options={ options } 
            addLabels={ addLabels } 
            loading={ loading } 
            project={ project } 
            edit={ edit }
            isSubtask={ selectedItem.parent_id && true }
            data={ selectedItem }
            i18n={ i18n }/> }
        { this.state.createSubtaskModalShow && 
          <CreateModal show 
            close={ () => { this.setState({ createSubtaskModalShow: false }); } } 
            options={ options } 
            create={ create } 
            loading={ loading } 
            project={ project } 
            parent={ selectedItem } 
            isSubtask={ true }
            i18n={ i18n }/> }
        { this.state.convertTypeModalShow &&
          <ConvertTypeModal show
            close={ () => { this.setState({ convertTypeModalShow: false }); } }
            options={ options }
            convert={ convert }
            loading={ loading }
            issue={ selectedItem }
            i18n={ i18n }/> }
        { this.state.convertType2ModalShow &&
          <ConvertType2Modal show
            close={ () => { this.setState({ convertType2ModalShow: false }); } }
            options={ options }
            project={ project } 
            convert={ convert }
            loading={ loading }
            issue={ selectedItem }
            i18n={ i18n }/> }
        { this.state.moveModalShow &&
          <MoveModal show
            close={ () => { this.setState({ moveModalShow: false }); } }
            options={ options }
            project={ project } 
            move={ move }
            loading={ loading }
            issue={ selectedItem }
            i18n={ i18n }/> }
        { this.state.assignModalShow &&
          <AssignModal show
            close={ () => { this.setState({ assignModalShow: false }); } }
            options={ options }
            setAssignee={ setAssignee }
            issue={ selectedItem }
            i18n={ i18n }/> }
        { this.state.setLabelsModalShow &&
          <SetLabelsModal
            show
            close={ () => { this.setState({ setLabelsModalShow: false }); } }
            options={ options }
            setLabels={ setLabels }
            addLabels={ addLabels }
            issue={ selectedItem }
            i18n={ i18n }/> }
        { this.state.shareModalShow &&
          <ShareLinkModal show
            close={ () => { this.setState({ shareModalShow: false }); } }
            project={ project }
            issue={ selectedItem }/> }
        { this.state.resetModalShow &&
          <ResetStateModal show
            close={ () => { this.setState({ resetModalShow: false }); } }
            options={ options }
            resetState={ resetState }
            issue={ selectedItem }
            i18n={ i18n }/> }
        { this.state.copyModalShow &&
          <CopyModal show
            close={ () => { this.setState({ copyModalShow: false }); } }
            options={ options }
            loading={ loading }
            copy={ copy }
            data={ selectedItem }
            i18n={ i18n }/> }
      </div>
    );
  }
}
