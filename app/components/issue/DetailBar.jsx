import React, { PropTypes, Component } from 'react';
import { 
  Modal, 
  Button, 
  ControlLabel, 
  FormControl, 
  Label, 
  Grid, 
  Row, 
  Col, 
  Table, 
  Tabs, 
  Tab, 
  Form, 
  FormGroup, 
  DropdownButton, 
  MenuItem, 
  ButtonToolbar, 
  ButtonGroup, 
  OverlayTrigger, 
  Popover, 
  ListGroup, 
  ListGroupItem 
} from 'react-bootstrap';
import { Link } from 'react-router';
import DropzoneComponent from 'react-dropzone-component';
import Lightbox from 'react-image-lightbox';
import Select from 'react-select';
import _ from 'lodash';
import { notify } from 'react-notify-toast';
import { getFileIconCss } from '../share/Funcs';
import { RichTextEditor, RichTextReader } from './RichText';
import { MultiRowsTextEditor, MultiRowsTextReader } from './MultiRowsText';

const $ = require('$');
const moment = require('moment');
const marked = require('marked');
const CreateModal = require('./CreateModal');
const Comments = require('./comments/Comments');
const History = require('./history/History');
const GitCommits = require('./gitcommits/GitCommits');
const Worklog = require('./worklog/Worklog');
const img = require('../../assets/images/loading.gif');
const PreviewModal = require('../workflow/PreviewModal');
const DelFileModal = require('./DelFileModal');
const LinkIssueModal = require('./LinkIssueModal');
const DelLinkModal = require('./DelLinkModal');
const ConvertTypeModal = require('./ConvertTypeModal');
const ConvertType2Modal = require('./ConvertType2Modal');
const MoveModal = require('./MoveModal');
const AssignModal = require('./AssignModal');
const SetLabelsModal = require('./SetLabelsModal');
const ShareLinkModal = require('./ShareLinkModal');
const ResetStateModal = require('./ResetStateModal');
const WorkflowCommentsModal = require('./WorkflowCommentsModal');
const DelNotify = require('./DelNotify');
const CopyModal = require('./CopyModal');
const WatcherListModal = require('./WatcherListModal');
const PeriodEditModal = require('../gantt/EditModal');

const { API_BASENAME } = process.env;

export default class DetailBar extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      tabKey: 1, 
      delFileShow: false, 
      selectedFile: {}, 
      inlinePreviewShow: {}, 
      previewShow: {}, 
      photoIndex: 0, 
      newAssignee: null,
      editAssignee: false, 
      editModalShow: false, 
      previewModalShow: false, 
      subtaskShow: true, 
      linkShow: true, 
      linkIssueModalShow: false, 
      delLinkModalShow: false, 
      delLinkData: {}, 
      createSubtaskModalShow: false, 
      moveModalShow: false, 
      convertTypeModalShow: false, 
      convertType2ModalShow: false, 
      assignModalShow: false, 
      setLabelsModalShow: false, 
      shareModalShow: false, 
      resetModalShow: false, 
      workflowScreenShow: false, 
      workflowCommentsShow: false, 
      delNotifyShow: false,
      copyModalShow: false,
      watchersModalShow: false,
      periodModalShow: false,
      newItemValues: [],
      editingItems: [],
      action_id: '' 
    };
    this.isAllowable = this.isAllowable.bind(this);
    this.delFileModalClose = this.delFileModalClose.bind(this);
    this.uploadSuccess = this.uploadSuccess.bind(this);
    this.goTo = this.goTo.bind(this);
    this.watch = this.watch.bind(this);
    this.getLabelStyle = this.getLabelStyle.bind(this);
    this.createLightbox = this.createLightbox.bind(this);
    this.getRichTextItemContents = this.getRichTextItemContents.bind(this);
    this.getTextAreaItemContents = this.getTextAreaItemContents.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    layout: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    record: PropTypes.func.isRequired,
    forward: PropTypes.func.isRequired,
    visitedIndex: PropTypes.number.isRequired, 
    visitedCollection: PropTypes.array.isRequired,
    issueCollection: PropTypes.array.isRequired,
    show: PropTypes.func.isRequired,
    detailFloatStyle: PropTypes.object,
    wfCollection: PropTypes.array.isRequired,
    wfLoading: PropTypes.bool.isRequired,
    viewWorkflow: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    fileLoading: PropTypes.bool.isRequired,
    delFile: PropTypes.func.isRequired,
    addFile: PropTypes.func.isRequired,
    setAssignee: PropTypes.func.isRequired,
    setItemValue: PropTypes.func.isRequired,
    setLabels: PropTypes.func.isRequired,
    addLabels: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
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
    close: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.itemLoading) {
      this.setState({ tabKey: 1, editAssignee: false, editingItems: [] });
    }
  }

  isAllowable(permission, oid) {
    const { options, user } = this.props;

    if (!options.permissions) {
      return false;
    }

    if (permission.indexOf('_self_') !== -1) {
      return oid == user.id && options.permissions.indexOf(permission) !== -1; 
    } else {
      return options.permissions.indexOf(permission) !== -1; 
    }
  }

  handleTabSelect(tabKey) {
    const { 
      indexComments, 
      indexHistory, 
      indexGitCommits, 
      indexWorklog, 
      commentsLoaded, 
      historyLoaded, 
      gitCommitsLoaded, 
      worklogLoaded, 
      data 
    } = this.props;

    this.setState({ tabKey });
    if (tabKey === 2 && !commentsLoaded) {
      indexComments(data.id);
    } else if (tabKey === 3 && !historyLoaded) {
      indexHistory(data.id);
    } else if (tabKey === 4 && !worklogLoaded) {
      indexWorklog(data.id);
    } else if (tabKey === 5 && !gitCommitsLoaded) {
      indexGitCommits(data.id);
    }
  }

  delFileNotify(field_key, id, name) {
    this.setState({ delFileShow: true, selectedFile: { field_key, id, name } });
  }

  delFileModalClose() {
    this.setState({ delFileShow: false });
  }

  uploadSuccess(localfile, res) {
    const { addFile } = this.props;
    if (res.ecode === 0 && res.data) {
      const { field = '', file = {} } = res.data;
      addFile(field, file); 
    } else {
      notify.show('文档上传失败。', 'error', 2000);
    }
  }

  openPreview(index, fieldkey) {
    const { options } = this.props;
    if (this.isAllowable('download_file')) {
      this.state.previewShow[fieldkey] = true;
      this.setState({ previewShow: this.state.previewShow, photoIndex: index });
    } else {
      notify.show('权限不足。', 'error', 2000);
    }
  }

  async viewWorkflow(e) {
    e.preventDefault();
    const { data, viewWorkflow } = this.props;
    if (!data.definition_id) { return; }
    const ecode = await viewWorkflow(data.definition_id);
    if (ecode === 0) {
      this.setState({ previewModalShow: true });
    } else {
      notify.show('预览失败。', 'error', 2000);
    }
  }

  async assignToMe(e) {
    e.preventDefault();
    const { setAssignee, data } = this.props;
    const ecode = await setAssignee(data.id, { assignee: 'me' });
    if (ecode === 0) {
      notify.show('已分配给我。', 'success', 2000);
    } else {
      notify.show('问题分配失败。', 'error', 2000);
    }
    // fix me
    //if (ecode === 0) {
    //} else {
    //}
  }

  editAssignee() {
    this.setState({ editAssignee: true });
  }

  async setAssignee() {
    const { setAssignee, data } = this.props;
    const ecode = await setAssignee(data.id, { assignee: this.state.newAssignee });
    if (ecode === 0) {
      this.setState({ editAssignee: false, newAssignee: null });
      notify.show('问题已分配。', 'success', 2000);
    } else {
      notify.show('问题分配失败。', 'error', 2000);
    }
  }

  cancelSetAssignee() {
    this.setState({ editAssignee: false, newAssignee: null });
  }

  async setItemValue(key, value) {
    const { setItemValue, data } = this.props;
    const { editingItems, newItemValues } = this.state;

    const ecode = await setItemValue(data.id, { [ key ]: value });
    if (ecode === 0) {
      editingItems[key] = false;
      newItemValues[key] = '';
      this.setState({ editingItems, newItemValues });
      notify.show('已更新。', 'success', 2000);
    } else {
      notify.show('更新失败。', 'error', 2000);
    }
  }

  cancelSetItem(key) {
    const { editingItems, newItemValues } = this.state;
    editingItems[key] = false;
    newItemValues[key] = '';
    this.setState({ editingItems, newItemValues });
  }

  handleAssigneeSelectChange(value) {
    this.setState({ newAssignee: value });
  }

  editModalClose() {
    this.setState({ editModalShow: false });
  }

  workflowScreenModalClose() {
    this.setState({ workflowScreenShow: false });
  }

  workflowCommentsModalClose() {
    this.setState({ workflowCommentsShow: false });
  }

  createSubtaskModalClose() {
    this.setState({ createSubtaskModalShow: false });
  }

  async next(curInd) {
    const { show, record, issueCollection=[] } = this.props;
    if (curInd < issueCollection.length - 1) {
      const nextInd = _.add(curInd, 1);
      const nextId = issueCollection[nextInd].id;
      const ecode = await show(nextId);
      if (ecode === 0) {
        record();
      }
    }
  }

  async previous(curInd) {
    const { show, record, issueCollection=[] } = this.props;
    if (curInd > 0 ) {
      const nextId = issueCollection[curInd - 1].id;
      const ecode = await show(nextId);
      if (ecode === 0) {
        record();
      }
    }
  }

  async forward(offset) {
    const { show, forward, visitedIndex, visitedCollection=[] } = this.props;
    const forwardIndex = _.add(visitedIndex, offset);
    if (visitedCollection[ forwardIndex ]) {
      const ecode = await show(visitedCollection[ forwardIndex ]);
      if (ecode === 0) {
        forward(offset);
      }
    }
  }

  async operateSelect(eventKey) {
    const { data, show, watch } = this.props;

    let ecode = 0;
    if (eventKey == 'refresh') {
      ecode = await show(data.id);
    } else if (eventKey == 'assign') {
      this.setState({ assignModalShow: true });
    } else if (eventKey == 'setLabels') {
      this.setState({ setLabelsModalShow: true });
    } else if (eventKey == 'link') {
      this.setState({ linkIssueModalShow: true });
    } else if (eventKey == 'createSubtask') {
      this.setState({ createSubtaskModalShow: true });
    } else if (eventKey == 'convert2Subtask') {
      this.setState({ convertType2ModalShow: true });
    } else if (eventKey == 'convert2Standard') {
      this.setState({ convertTypeModalShow: true });
    } else if (eventKey == 'move') {
      this.setState({ moveModalShow: true });
    } else if (eventKey == 'share') {
      this.setState({ shareModalShow: true });
    } else if (eventKey == 'copy') {
      this.setState({ copyModalShow: true });
    } else if (eventKey == 'reset') {
      this.setState({ resetModalShow: true });
    } else if (eventKey == 'watch') {
      const watching = data.watching;
      this.watch(data.id, !watching);
    } else if (eventKey == 'watchers') {
      this.setState({ watchersModalShow : true });
    } else if (eventKey == 'del') {
      this.setState({ delNotifyShow : true });
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

  delLink(linkData) {
    this.setState({ delLinkModalShow: true, delLinkData: linkData });
  }

  async goTo(issue_id) {
    const { show, record } = this.props;
    const ecode = await show(issue_id);
    if (ecode === 0) {
      record();
    }
  }

  async doAction(action_id) {
    const { doAction, data } = this.props;
    const action = _.find(data.wfactions || {}, { id: action_id });
    if (action && action.screen) {
      //if (action.screen == 'comments') {
      //  this.setState({ workflowCommentsShow: true, action_id });
      //} else {
      //  this.setState({ workflowScreenShow: true, action_id });
      //}
      this.setState({ workflowScreenShow: true, action_id });
    } else {
      const ecode = await doAction(data.id, data.entry_id, { action_id });
      if (ecode === 0) {
        notify.show('提交完成。', 'success', 2000);
      } else {
        notify.show('提交失败。', 'error', 2000);
      }
    }
  }

  async actionSelect(eventKey) {
    const { data, doAction } = this.props;
    const action = _.find(data.wfactions || {}, { id: eventKey });
    if (action && action.schema) {
      this.setState({ workflowScreenShow: true, action_id: eventKey });
    } else {
      const ecode = await doAction(data.id, data.entry_id, { action_id: eventKey });
      if (ecode === 0) {
        notify.show('提交完成。', 'success', 2000);
      } else {
        notify.show('提交失败。', 'error', 2000);
      }
    }
  }

  previewInlineImg(e) {
    const { options } = this.props;

    if (!this.isAllowable('download_file')) {
      notify.show('权限不足。', 'error', 2000);
      return;
    }

    const targetid = e.target.id;
    if (!targetid) {
      return;
    }

    let fieldkey = '';
    let imgInd = -1;
    if (targetid.indexOf('inlineimg-') === 0) {
      fieldkey = targetid.substring(10, targetid.lastIndexOf('-'));
      imgInd = targetid.substr(targetid.lastIndexOf('-') + 1) - 0;
    } else {
      return;
    }

    this.state.inlinePreviewShow[fieldkey] = true;
    this.setState({ inlinePreviewShow: this.state.inlinePreviewShow, photoIndex: imgInd });
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

  createLightbox(field_key, imgFiles, photoIndex) {
    const { project } = this.props;
    return (
      <Lightbox
        mainSrc={ API_BASENAME + '/project/' + project.key + '/file/' + imgFiles[photoIndex].id }
        nextSrc={ API_BASENAME + '/project/' + project.key + '/file/' + imgFiles[(photoIndex + 1) % imgFiles.length].id }
        prevSrc={ API_BASENAME + '/project/' + project.key + '/file/' + imgFiles[(photoIndex + imgFiles.length - 1) % imgFiles.length].id }
        imageTitle={ imgFiles[photoIndex].name }
        imageCaption={ imgFiles[photoIndex].uploader.name + ' 上传于 ' + imgFiles[photoIndex].created_at }
        onCloseRequest={ () => { this.state.previewShow[field_key] = false; this.setState({ previewShow: this.state.previewShow }) } }
        onMovePrevRequest={ () => this.setState({ photoIndex: (photoIndex + imgFiles.length - 1) % imgFiles.length }) }
        onMoveNextRequest={ () => this.setState({ photoIndex: (photoIndex + 1) % imgFiles.length }) } /> );
  }

  getTextAreaItemContents(txt, fieldKey, fieldName, required, maxLength) {
    const { editingItems, newItemValues } = this.state;
    const { project, data, options } = this.props;

    if (editingItems[fieldKey]) {
      return (
        <div>
          <MultiRowsTextEditor
            id={ 'field-textarea-' + fieldKey }
            value={ txt || '' }
            placeholder={ '输入' + fieldName + (maxLength && maxLength > 0 ? ('(字数' + maxLength + '字之内)') : '') }
            uploadUrl={ API_BASENAME + '/project/' + project.key + '/file' }
            onChange={ (newValue) => { newItemValues[fieldKey] = newValue; this.setState({ newItemValues: this.state.newItemValues }) } }/>
          <div className='edit-button-group'>
            <Button className='edit-ok-button' onClick={ this.setItemValue.bind(this, fieldKey, newItemValues[fieldKey]) } disabled={ _.isEqual(txt || '', newItemValues[fieldKey] || '') || (required && !newItemValues[fieldKey]) || (maxLength && maxLength > 0 && _.trim(newItemValues[fieldKey] || '').length > maxLength) }><i className='fa fa-check'></i></Button>
            <Button className='edit-cancel-button' onClick={ () => { editingItems[fieldKey] = false; newItemValues[fieldKey] = txt; this.setState({ editingItems }); } }><i className='fa fa-close'></i></Button>
          </div>
        </div> );
    }

    return (
      <MultiRowsTextReader
        isImgPreviewed={ this.isAllowable('download_file') }
        isEditable={ this.isAllowable('edit_issue') || this.isAllowable('edit_self_issue', data.reporter && data.reporter.id || '') }
        onEdit={ () => { editingItems[fieldKey] = true; newItemValues[fieldKey] = txt; this.setState({ editingItems }); } }
        fieldKey={ fieldKey }
        value={ txt }/>);
  }

  getRichTextItemContents(txt, fieldKey, fieldName, required, maxLength) {
    const { editingItems, newItemValues } = this.state;
    const { project, data, options } = this.props;

    if (editingItems[fieldKey]) {
      return (
        <div>
          <RichTextEditor
            id={ 'field-richeditor-' + fieldKey }
            value={ txt || '' }
            placeholder={ '输入' + fieldName + (maxLength && maxLength > 0 ? ('(字数' + maxLength + '字之内)') : '') }
            uploadUrl={ API_BASENAME + '/project/' + project.key + '/file' }
            onChange={ (newValue) => { newItemValues[fieldKey] = newValue; this.setState({ newItemValues: this.state.newItemValues }) } }/> 
          <div className='edit-button-group'>
            <Button className='edit-ok-button' onClick={ this.setItemValue.bind(this, fieldKey, newItemValues[fieldKey]) } disabled={ _.isEqual(txt || '', newItemValues[fieldKey] || '') || (required && !newItemValues[fieldKey]) || (maxLength && maxLength > 0 && _.trim(newItemValues[fieldKey] || '').length > maxLength) }><i className='fa fa-check'></i></Button>
            <Button className='edit-cancel-button' onClick={ () => { editingItems[fieldKey] = false; this.setState({ editingItems }); } }><i className='fa fa-close'></i></Button>
          </div>
        </div> );
    }

    return (
      <RichTextReader
        isImgPreviewed={ this.isAllowable('download_file') }
        isEditable={ this.isAllowable('edit_issue') || this.isAllowable('edit_self_issue', data.reporter && data.reporter.id || '') }
        onEdit={ () => { editingItems[fieldKey] = true; newItemValues[fieldKey] = txt; this.setState({ editingItems }); } }
        fieldKey={ fieldKey }
        value={ txt }/>);
  }

  componentDidMount() {
    $('.animate-dialog .nav-tabs>li>a:first').css('border-left', '0px');

    const { detailFloatStyle={}, layout } = this.props;

    const width = _.min([ _.max([ layout.containerWidth / 2, 660 ]), 1000 ]);
    const initialStyles = { width: width + 'px' };
    const animateStyles = {};

    if (detailFloatStyle.left !== undefined) {
      initialStyles.left = detailFloatStyle.left - width;
      animateStyles.left = detailFloatStyle.left;
    } else {
      initialStyles.right = -width;
      animateStyles.right = 0;
    }
    $('.animate-dialog').css(initialStyles);
    $('.animate-dialog').animate(animateStyles);
  }

  render() {
    const { 
      i18n,
      layout,
      close, 
      detailFloatStyle={},
      data={}, 
      record, 
      visitedIndex, 
      visitedCollection, 
      issueCollection=[], 
      loading, 
      itemLoading, 
      options, 
      project, 
      fileLoading, 
      delFile, 
      create, 
      edit, 
      del,
      copy,
      move,
      convert,
      setAssignee,
      setItemValue,
      setLabels,
      addLabels,
      resetState,
      wfCollection, 
      wfLoading, 
      indexComments, 
      sortComments, 
      commentsCollection, 
      commentsIndexLoading, 
      commentsLoading, 
      commentsItemLoading, 
      addComments, 
      editComments, 
      delComments, 
      indexHistory, 
      sortHistory, 
      historyCollection, 
      historyIndexLoading, 
      indexGitCommits,
      sortGitCommits,
      gitCommitsCollection,
      gitCommitsIndexLoading,
      indexWorklog, 
      worklogSort,
      sortWorklog, 
      worklogCollection, 
      worklogIndexLoading, 
      worklogLoading, 
      addWorklog, 
      editWorklog, 
      delWorklog, 
      createLink, 
      delLink, 
      linkLoading, 
      doAction,
      user 
    } = this.props;

    const { 
      inlinePreviewShow, 
      previewShow, 
      photoIndex, 
      newAssignee, 
      editAssignee, 
      editingItems,
      newItemValues,
      delFileShow, 
      selectedFile, 
      action_id 
    } = this.state;

    const specialFields = [
      'title', 
      'resolution', 
      'priority', 
      'assignee', 
      'descriptions', 
      'epic', 
      'labels', 
      'resolve_version', 
      'expect_start_time', 
      'expect_complete_time', 
      'progress'
    ];

    const panelStyle = { marginBottom: '0px', borderTop: '0px', borderRadius: '0px' };

    const assigneeOptions = _.map(options.assignees || [], (val) => { 
      return { label: val.name + '(' + val.email + ')', value: val.id } 
    });

    const subtaskTypeOptions = [];
    _.map(options.types, (val) => {
      if (val.type == 'subtask' && !val.disabled) {
        subtaskTypeOptions.push(val);
      }
    });

    const type = _.find(options.types, { id : data.type });
    const schema = type && type.schema ? type.schema : [];

    const curInd = _.findIndex(issueCollection, { id: data.id });

    const priorityInd = data.priority ? _.findIndex(options.priorities, { id: data.priority }) : -1;
    const priorityStyle = { marginLeft: '5px', marginRight: '5px' };
    if (priorityInd !== -1) {
      _.extend(priorityStyle, { backgroundColor: options.priorities[priorityInd].color });
    }

    const stateInd = data.state ? _.findIndex(options.states, { id: data.state }) : -1;
    let stateClassName = '';
    if (stateInd !== -1) {
      stateClassName = 'state-' + options.states[stateInd].category + '-label';
    }

    let descRequired = false;
    const fi = _.findIndex(schema, { key: 'descriptions' });
    if (fi !== -1) {
      descRequired = schema[fi].required && true;
    }

    let selectedEpic = {};
    if (data.epic) {
      selectedEpic = _.find(options.epics, { id: data.epic });
    }

    //const storage = window.localStorage;
    //let issueStorage = storage.getItem(project.key + '-' + data.no);
    //if (issueStorage) {
    //  issueStorage = JSON.parse(issueStorage); 
    //}

    const commentsTab = (
      <div>
        <span style={ { paddingRight: '6px' } }>评论{ !itemLoading && '(' + (data.comments_num > 99 ? '99+' : (data.comments_num || 0)) + ')' }</span>
      </div>);

    const worklogTab = (
      <div>
        <span style={ { paddingRight: '6px' } }>工作日志{ !itemLoading && '(' + (data.worklogs_num > 99 ? '99+' : (data.worklogs_num || 0)) + ')' }</span>
      </div>);

    const gitTab = (
      <div>
        <span style={ { paddingRight: '6px' } }>Git提交{ !itemLoading && '(' + (data.gitcommits_num > 99 ? '99+' : (data.gitcommits_num || 0)) + ')' }</span>
      </div>);

    const width = _.min([ _.max([ layout.containerWidth / 2, 660 ]), 1000 ]) + 'px';

    return (
      <div 
        className='animate-dialog' 
        style={ { width } } 
        onClick={ (e) => { e.stopPropagation(); } }
        onMouseUp={ (e) => { e.stopPropagation(); } }>
        <Button className='close' onClick={ close } title='关闭'>
          <i className='fa fa-close'></i>
        </Button>
        <Button className={ curInd < 0 || curInd >= issueCollection.length - 1 ? 'angle-disable' : 'angle' } onClick={ this.next.bind(this, curInd) } disabled={ curInd < 0 || curInd >= issueCollection.length - 1 } title='下一个'>
          <i className='fa fa-angle-down'></i>
        </Button>
        <Button className={ curInd <= 0 ? 'angle-disable' : 'angle' } onClick={ this.previous.bind(this, curInd) } disabled={ curInd <= 0 } title='上一个'>
          <i className='fa fa-angle-up'></i>
        </Button>
        <Button className={ visitedIndex < 0 || visitedIndex >= visitedCollection.length - 1 ? 'angle-disable' : 'angle' } onClick={ this.forward.bind(this, 1) } disabled={ visitedIndex < 0 || visitedIndex >= visitedCollection.length - 1 } title='前进'>
          <i className='fa fa-angle-right'></i>
        </Button>
        <Button className={ visitedIndex <= 0 ? 'angle-disable' : 'angle' } onClick={ this.forward.bind(this, -1) } disabled={ visitedIndex <= 0 } title='后退'>
          <i className='fa fa-angle-left'></i>
        </Button>
        <Button className='angle' title={ data.watching ? '点击取消关注' : '点击关注' } onClick={ () => { this.watch(data.id, !data.watching) } }>
          { data.watching ? <i className='fa fa-eye-slash'></i> : <i className='fa fa-eye'></i> }
        </Button>
        <div className='panel panel-default' style={ panelStyle }>
          <Tabs activeKey={ this.state.tabKey } onSelect={ this.handleTabSelect.bind(this) } id='issue-detail-tab'>
            <Tab eventKey={ 1 } title='基本'>
              <div className='detail-view-blanket' style={ { display: itemLoading ? 'block' : 'none' } }>
                <img src={ img } className='loading detail-loading'/>
              </div>
              <Form horizontal className={ itemLoading && 'hide' } style={ { marginRight: '15px', marginBottom: '40px', marginLeft: '15px' } }>
                <ButtonToolbar style={ { margin: '15px 0px 15px -5px' } }>
                  { (this.isAllowable('edit_issue') || this.isAllowable('edit_self_issue', data.reporter && data.reporter.id || '')) && <Button onClick={ () => { this.setState({ editModalShow: true }) } }><i className='fa fa-edit'></i> 编辑</Button> }
                  { this.isAllowable('exec_workflow') && (
                    data.wfactions && data.wfactions.length <= 4 ?
                    <ButtonGroup style={ { marginLeft: '10px' } }>
                    { _.map(data.wfactions || [], (v, i) => {
                      return ( <Button key={ v.id } onClick={ this.doAction.bind(this, v.id) }>{ v.name }</Button> ); 
                    }) }
                    </ButtonGroup>
                    :
                    <div style={ { float: 'left', marginLeft: '10px' } }>
                      <DropdownButton title='动作' onSelect={ this.actionSelect.bind(this) }>
                      { _.map(data.wfactions || [], (v, i) => {
                        return ( <MenuItem eventKey={ v.id }>{ v.name }</MenuItem> ); 
                      }) }
                      </DropdownButton>
                    </div> ) }
                  <div style={ { float: 'right' } }>
                    <DropdownButton pullRight title='更多' onSelect={ this.operateSelect.bind(this) }>
                      <MenuItem eventKey='refresh'>刷新</MenuItem>
                      { this.isAllowable('assign_issue') && <MenuItem eventKey='assign'>分配</MenuItem> }
                      { (this.isAllowable('edit_issue') || this.isAllowable('edit_self_issue', data.reporter && data.reporter.id || '')) && <MenuItem eventKey='setLabels'>设置标签</MenuItem> }
                      <MenuItem divider/>
                      <MenuItem eventKey='watch'>{ data.watching ? '取消关注' : '关注' }</MenuItem>
                      <MenuItem eventKey='watchers' disabled={ !data.watchers || data.watchers.length <= 0 }><span>查看关注者 <span className='badge-number'>{ data.watchers && data.watchers.length }</span></span></MenuItem>
                      <MenuItem eventKey='share'>分享链接</MenuItem>
                      { !data.parent_id && subtaskTypeOptions.length > 0 && (((this.isAllowable('edit_issue') || this.isAllowable('edit_self_issue', data.reporter && data.reporter.id || '')) && !data.hasSubtasks) || this.isAllowable('create_issue')) && <MenuItem divider/> }
                      { !data.parent_id && subtaskTypeOptions.length > 0 && this.isAllowable('create_issue') && <MenuItem eventKey='createSubtask'>创建子任务</MenuItem> }
                      { !data.hasSubtasks && !data.parent_id && subtaskTypeOptions.length > 0 && (this.isAllowable('edit_issue') || this.isAllowable('edit_self_issue', data.reporter && data.reporter.id || '')) && <MenuItem eventKey='convert2Subtask'>转换为子任务</MenuItem> }
                      { data.parent_id && (this.isAllowable('edit_issue') || this.isAllowable('edit_self_issue', data.reporter && data.reporter.id || '')) && <MenuItem divider/> }
                      { data.parent_id && (this.isAllowable('edit_issue') || this.isAllowable('edit_self_issue', data.reporter && data.reporter.id || '')) && <MenuItem eventKey='convert2Standard'>转换为标准问题</MenuItem> }
                      { options.permissions && (_.intersection(options.permissions, ['link_issue', 'create_issue']).length > 0 || (options.permissions.indexOf('move_issue') !== -1 && data.parent_id)) && <MenuItem divider/> }
                      { this.isAllowable('move_issue') && data.parent_id && <MenuItem eventKey='move'>移动</MenuItem> }
                      { this.isAllowable('link_issue') && <MenuItem eventKey='link'>链接</MenuItem> }
                      { this.isAllowable('create_issue') && <MenuItem eventKey='copy'>复制</MenuItem> }
                      { (this.isAllowable('reset_issue') || this.isAllowable('delete_issue') || this.isAllowable('delete_self_issue', data.reporter && data.reporter.id || '')) && <MenuItem divider/> }
                      { this.isAllowable('reset_issue') && <MenuItem eventKey='reset'>重置状态</MenuItem> }
                      { (this.isAllowable('delete_issue') || this.isAllowable('delete_self_issue', data.reporter && data.reporter.id || '')) && <MenuItem eventKey='del'>删除</MenuItem> }
                    </DropdownButton>
                  </div>
                </ButtonToolbar>
                <FormGroup>
                  <Col sm={ 3 } componentClass={ ControlLabel }>
                    主题/NO 
                  </Col>
                  <Col sm={ 9 }>
                    <div style={ { marginTop: '7px', whiteSpace: 'pre-wrap', wordWrap: 'break-word' } }>
                      { data.parent && 
                        <a href='#' onClick={ (e) => { e.preventDefault(); this.goTo(data.parent.id); } }>
                          { data.parent.no + '-' + (data.parent.title || '') }
                        </a> }
                      { data.parent && ' / ' }{ data.no + '-' + (data.title || '') }
                    </div>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col sm={ 3 } componentClass={ ControlLabel }>
                    类型 
                  </Col>
                  <Col sm={ 3 }>
                    <div style={ { marginTop: '7px' } }>
                      <span className='type-abb'>
                        { type ? type.abb : '-' }
                      </span>
                      { type ? type.name : '-' }
                    </div>
                  </Col>
                  <Col sm={ 2 } componentClass={ ControlLabel }>
                    状态
                  </Col>
                  <Col sm={ 4 }>
                    <div style={ { marginTop: '7px' } }>
                      { stateInd !== -1 ? <span className={ stateClassName }>{ options.states[stateInd].name }</span> : '-' } 
                      { !wfLoading ? <a href='#' onClick={ this.viewWorkflow.bind(this) }><span style={ { marginLeft: '5px' } }>(查看)</span></a> : <img src={ img } className='small-loading'/> }
                    </div>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col sm={ 3 } componentClass={ ControlLabel }>
                    优先级
                  </Col>
                  <Col sm={ 3 }>
                    <div style={ { marginTop: '7px' } }>
                      { priorityInd !== -1 && <div className='circle' style={ priorityStyle }/> }
                      { priorityInd !== -1 ? options.priorities[priorityInd].name : <span className='issue-contents-nosetting'>未设置</span> }
                    </div>
                  </Col>
                  <Col sm={ 2 } componentClass={ ControlLabel }>
                    解决结果
                  </Col>
                  <Col sm={ 4 }>
                    <div style={ { marginTop: '7px' } }>
                      { _.find(options.resolutions || [], { id: data.resolution }) ? _.find(options.resolutions, { id: data.resolution }).name : '-' }
                    </div>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col sm={ 3 } componentClass={ ControlLabel }>
                    负责人
                  </Col>
                  <Col sm={ editAssignee ? 7 : 3 }>
                    { !editAssignee ?
                    <div style={ { marginTop: '4px' } }>
                      { this.isAllowable('assign_issue') ?
                      <div className='editable-list-field' style={ { display: 'table', width: '100%' } }>
                        <span>
                          <div style={ { display: 'inline-block', float: 'left', margin: '5px 0px 3px 5px' } }>
                            { data['assignee'] && data['assignee'].name || '-' }
                          </div>
                        </span>
                        <span className='edit-icon-zone edit-icon' onClick={ this.editAssignee.bind(this) }><i className='fa fa-pencil'></i></span>
                      </div> 
                      : 
                      <div style={ { marginTop: '7px' } }>
                        <span>{ data['assignee'] && data['assignee'].name || '-' }</span>
                      </div> }
                      { (!data['assignee'] || data['assignee'].id !== user.id) && this.isAllowable('assigned_issue') &&
                      <span style={ { float: 'left', marginLeft: '5px' } }><a href='#' onClick={ this.assignToMe.bind(this) }>分配给我</a></span> }
                    </div>
                    :
                    <div style={ { marginTop: '0px' } }>
                      <Select 
                        simpleValue 
                        clearable={ false } 
                        options={ assigneeOptions } 
                        value={ newAssignee || data['assignee'].id } 
                        onChange={ this.handleAssigneeSelectChange.bind(this) } 
                        placeholder='选择负责人'/>
                      <div className='edit-button-group'>
                        <Button className='edit-ok-button' onClick={ this.setAssignee.bind(this) }><i className='fa fa-check'></i></Button>
                        <Button className='edit-cancel-button' onClick={ this.cancelSetAssignee.bind(this) }><i className='fa fa-close'></i></Button>
                      </div>
                    </div> }
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col sm={ 3 } componentClass={ ControlLabel }>
                    描述
                  </Col>
                  <Col sm={ 9 }>
                    <div style={ { marginTop: '7px' } }>
                      { this.getRichTextItemContents(data.descriptions, 'descriptions', '描述', descRequired) }
                    </div>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col sm={ 3 } componentClass={ ControlLabel }>
                    标签 
                  </Col>
                  <Col sm={ 9 }>
                    <div style={ { marginTop: '7px' } }>
                    { data.labels && data.labels.length > 0 ?
                      _.map(data.labels, (v, i) => 
                      <Link to={ '/project/' + project.key + '/issue?labels=' + v } key={ i }>
                        <span title={ v } className='issue-label' style={ this.getLabelStyle(v) }>
                          { v }
                        </span>
                      </Link> ) 
                      :
                      <span className='issue-contents-nosetting'>未设置</span>
                    }
                    </div>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col sm={ 3 } componentClass={ ControlLabel }>
                    解决版本 
                  </Col>
                  <Col sm={ 9 }>
                    <div style={ { marginTop: '7px' } }>
                     { _.find(options.versions, { id: data.resolve_version }) ? _.find(options.versions, { id: data.resolve_version }).name : <span className='issue-contents-nosetting'>未设置</span> }
                    </div>
                  </Col>
                </FormGroup>

                { _.map(schema, (field, key) => {
                  if (specialFields.indexOf(field.key) !== -1) {
                    return;
                  }
                  if (field.type === 'File') {
                    if (!this.isAllowable('upload_file') && _.isEmpty(data[field.key])) {
                      return;
                    }
                  } else if (_.isEmpty(data[field.key]) && !_.isNumber(data[field.key])) {
                    return (
                      <FormGroup key={ 'form-' + key }>
                        <Col sm={ 3 } componentClass={ ControlLabel }>
                          { field.name || '-' }
                        </Col>
                        <Col sm={ 9 }>
                          <div style={ { marginTop: '7px' } }>
                            <span style={ { color: '#909090' } }>未设置</span>
                          </div>
                        </Col>
                      </FormGroup>
                    );
                  }

                  let contents = '';
                  if (field.type === 'SingleUser') {
                    contents = data[field.key] && data[field.key].name || '-';
                  } else if (field.type === 'MultiUser') {
                    contents = _.map(data[field.key] || [], (v) => v.name).join(', ');
                  } else if (field.type === 'Select' || field.type === 'RadioGroup' || field.type === 'SingleVersion') {
                    const optionValues = field.optionValues || [];
                    contents = _.find(optionValues, { id: data[field.key] }) ? _.find(optionValues, { id: data[field.key] }).name : '-';
                  } else if (field.type === 'MultiSelect' || field.type === 'CheckboxGroup' || field.type === 'MultiVersion') {
                    const optionValues = field.optionValues || [];
                    const values = !_.isArray(data[field.key]) ? data[field.key].split(',') : data[field.key];
                    const newValues = [];
                    _.map(values, (v, i) => {
                      if (_.find(optionValues, { id: v })) {
                        newValues.push(_.find(optionValues, { id: v }).name);
                      }
                    });
                    contents = newValues.join(', ') || '-';
                  } else if (field.type === 'DatePicker') {
                    contents = moment.unix(data[field.key]).format('YYYY/MM/DD');
                  } else if (field.type === 'DateTimePicker') {
                    contents = moment.unix(data[field.key]).format('YYYY/MM/DD HH:mm');
                  } else if (field.type === 'File') {
                    const componentConfig = {
                      showFiletypeIcon: true,
                      postUrl: API_BASENAME + '/project/' + project.key + '/file?issue_id=' + data.id 
                    };
                    const djsConfig = {
                      parallelUploads: 1,
                      addRemoveLinks: false,
                      dictDefaultMessage: '点击或拖拽文件至此',
                      paramName: field.key
                    };
                    const eventHandlers = {
                      init: dz => this.dropzone = dz,
                      success: (localfile, response) => { this.uploadSuccess(localfile, response); this.dropzone.removeFile(localfile); },
                      error: (localfile) => { notify.show('文档上传失败。', 'error', 2000); this.dropzone.removeFile(localfile); }
                    };

                    const imgFiles = _.filter(data[field.key], (f) => { return _.indexOf([ 'image/jpeg', 'image/jpg', 'image/png', 'image/gif' ], f.type) !== -1 });
                    const noImgFiles = _.filter(data[field.key], (f) => { return _.indexOf([ 'image/jpeg', 'image/jpg', 'image/png', 'image/gif' ], f.type) === -1 });
                    contents = (<div>
                      { noImgFiles.length > 0 &&
                        <Table condensed hover responsive style={ { borderBottom: '1px solid #ddd' } }>
                          <tbody>
                            { _.map(noImgFiles, (f, i) => 
                              <tr key={ i }>
                                <td>
                                  <span style={ { marginRight: '5px', color: '#777' } }><i className={ getFileIconCss(f.name) }></i></span> 
                                  { this.isAllowable('download_file') ? 
                                    <a target='_blank' href={ API_BASENAME + '/project/' + project.key + '/file/' + f.id + (f.type == 'application/pdf' ? ('/' + f.name) : '') } download={ f.type == 'application/pdf' ? false : f.name }>{ f.name }</a> :
                                    <span>{ f.name }</span> }
                                </td>
                                { (this.isAllowable('remove_file') || this.isAllowable('remove_self_file', f.uploader && f.uploader.id || '')) && 
                                  <td width='2%'>
                                    <span className='remove-icon' onClick={ this.delFileNotify.bind(this, field.key, f.id, f.name) }>
                                      <i className='fa fa-trash'></i>
                                    </span>
                                  </td> }
                              </tr> ) }
                          </tbody>
                        </Table> }

                      { imgFiles.length > 0 && 
                        <Grid style={ { paddingLeft: '0px' } }>
                          <Row>
                          { _.map(imgFiles, (f, i) =>
                            <Col sm={ 6 } key={ i }>
                              <div className='attachment-content'>
                                <div className='attachment-thumb' onClick={ this.openPreview.bind(this, i, field.key) }>
                                  <img src={ API_BASENAME + '/project/' + project.key + '/file/' + f.id + '/thumbnail' }/>
                                </div>
                                <div className='attachment-title-container'>
                                   <div className='attachment-title' title={ f.name }>{ f.name }</div>
                                   { (this.isAllowable('remove_file') || this.isAllowable('remove_self_file', f.uploader && f.uploader.id || '')) && 
                                     <div className='remove-icon' onClick={ this.delFileNotify.bind(this, field.key, f.id, f.name) }><i className='fa fa-trash'></i></div> }
                                </div>
                              </div>
                            </Col> ) }
                          </Row>
                        </Grid> }
                      { this.isAllowable('upload_file') &&
                      <div style={ { marginTop: '8px' } }>
                        <DropzoneComponent 
                          config={ componentConfig } 
                          eventHandlers={ eventHandlers } 
                          djsConfig={ djsConfig } />
                      </div> }
                      { previewShow[field.key] && this.createLightbox(field.key, imgFiles, photoIndex) }
                    </div>);
                  } else if (field.type === 'TextArea') {
                    contents = this.getTextAreaItemContents(data[field.key], field.key, field.name, field.required, field.maxLength);
                  } else if (field.type === 'RichTextEditor') {
                    contents = this.getRichTextItemContents(data[field.key], field.key, field.name, field.required, field.maxLength);
                  } else {
                    contents = data[field.key];
                  }
                  return (
                    <FormGroup key={ 'form-' + key }>
                      <Col sm={ 3 } componentClass={ ControlLabel }>
                        { field.name || '-' }
                      </Col>
                      <Col sm={ 9 }>
                        <div style={ { marginTop: '7px' } }>
                          { contents }
                        </div>
                      </Col>
                    </FormGroup>
                  );
                }) }

                <div className='issue-contents-diviver'>
                  <span className='issue-contents-diviver-title'>
                    迭代  
                  </span>
                </div>
                <FormGroup>
                  <Col sm={ 3 } componentClass={ ControlLabel }>
                    Epic
                  </Col>
                  <Col sm={ 9 }>
                    <div style={ { marginTop: '7px' } }>
                      <Link to={ '/project/' + project.key + '/issue?epic=' + data.epic }>
                        { selectedEpic.name ?
                        <span className='epic-title' style={ { borderColor: selectedEpic.bgColor, backgroundColor: selectedEpic.bgColor, maxWidth: '100%', marginRight: '5px', marginTop: '0px', float: 'left' } } title={ selectedEpic.name || '-' } >
                          { selectedEpic.name }
                        </span>
                        :
                        <span className='issue-contents-nosetting'>未设置</span> }
                      </Link>
                    </div>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col sm={ 3 } componentClass={ ControlLabel }>
                    Sprint
                  </Col>
                  <Col sm={ 9 }>
                    <div style={ { marginTop: '7px' } }>
                      { data.sprints && data.sprints.length > 0 ? 
                        _.map(data.sprints, (v) => { return _.find(options.sprints, { no: v }).name }).join(', ')
                        :
                       <span className='issue-contents-nosetting'>未设置</span> }
                    </div>
                  </Col>
                </FormGroup>

                <div className='issue-contents-diviver'>
                  <span className='issue-contents-diviver-title'>
                    周期进度
                  </span>
                  { this.isAllowable('edit_issue') &&
                  <span 
                    className='comments-button issue-block-edit-button'
                    title='设置' 
                    onClick={ () => { this.setState({ periodModalShow: true }); } }>
                    <i className='fa fa-edit'></i>
                  </span> }
                </div>
                <FormGroup>
                  <Col sm={ 3 } componentClass={ ControlLabel }>
                    计划开始时间
                  </Col>
                  <Col sm={ 2 }>
                    <div style={ { marginTop: '7px' } }>
                      { data.expect_start_time ? moment.unix(data.expect_start_time).format('YYYY/MM/DD') : <span className='issue-contents-nosetting'>未设置</span> }
                    </div>
                  </Col>
                  <Col sm={ 3 } componentClass={ ControlLabel }>
                    计划完成时间
                  </Col>
                  <Col sm={ 2 }>
                    <div style={ { marginTop: '7px' } }>
                      { data.expect_start_time ? moment.unix(data.expect_complete_time).format('YYYY/MM/DD') : <span className='issue-contents-nosetting'>未设置</span> }
                    </div>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col sm={ 3 } componentClass={ ControlLabel }>
                    进度
                  </Col>
                  <Col sm={ 3 }>
                    { !editingItems['progress'] ?
                    <div style={ { marginTop: '4px' } }>
                      { (this.isAllowable('edit_issue') || this.isAllowable('edit_self_issue', data.reporter && data.reporter.id || '')) ?
                      <div className='editable-list-field' style={ { display: 'table', width: '100%' } }>
                        <div style={ { display: 'inline-block', float: 'left', margin: '5px 0px 3px 5px' } }>
                          { _.isNumber(data.progress) ? data.progress + '%' : <span className='issue-contents-nosetting'>未设置</span> }
                        </div>
                        <span 
                          className='edit-icon-zone edit-icon' 
                          onClick={ () => { editingItems['progress'] = true; newItemValues['progress'] = data['progress'] || 0;  this.setState({ editingItems, newItemValues }) } }>
                          <i className='fa fa-pencil'></i>
                        </span>
                      </div> 
                      : 
                      <div style={ { marginTop: '7px' } }>
                        { _.isNumber(data.progress) ? data.progress + '%' : <span className='issue-contents-nosetting'>未设置</span> }
                      </div> }
                    </div>
                    :
                    <div style={ { marginTop: '0px' } }>
                      <FormControl 
                        type='number' 
                        min='0'
                        value={ newItemValues['progress'] || 0 } 
                        onChange={ (e) => { newItemValues['progress'] = e.target.value; this.setState({ newItemValues }) } }
                        placeholder='进度值'/>
                      <div className='edit-button-group'>
                        <Button className='edit-ok-button' onClick={ this.setItemValue.bind(this, 'progress', newItemValues['progress'] - 0) }><i className='fa fa-check'></i></Button>
                        <Button className='edit-cancel-button' onClick={ this.cancelSetItem.bind(this, 'progress') }><i className='fa fa-close'></i></Button>
                      </div>
                    </div> }
                  </Col>
                </FormGroup>

                <div className='issue-contents-diviver'>
                  <span className='issue-contents-diviver-title'>
                    人员时间 
                  </span>
                </div>
                <FormGroup>
                  <Col sm={ 3 } componentClass={ ControlLabel }>
                    创建者
                  </Col>
                  <Col sm={ 3 }>
                    <div style={ { marginTop: '7px' } }>
                      <span>{ data['reporter'] && data['reporter'].name || '-' }</span>
                    </div>
                  </Col>
                  <Col sm={ 2 } componentClass={ ControlLabel }>
                    创建时间
                  </Col>
                  <Col sm={ 4 }>
                    <div style={ { marginTop: '7px' } }>
                      { data.created_at ? moment.unix(data.created_at).format('YYYY/MM/DD HH:mm') : '-' }
                    </div>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col sm={ 3 } componentClass={ ControlLabel }>
                    更新者
                  </Col>
                  <Col sm={ 3 }>
                    <div style={ { marginTop: '7px' } }>
                      <span>{ data['reporter'] && data['reporter'].name || '-' }</span>
                    </div>
                  </Col>
                  <Col sm={ 2 } componentClass={ ControlLabel }>
                    更新时间
                  </Col>
                  <Col sm={ 4 }>
                    <div style={ { marginTop: '7px' } }>
                      { data.updated_at ? moment.unix(data.updated_at).format('YYYY/MM/DD HH:mm') : (data.created_at ? moment.unix(data.created_at).format('YYYY/MM/DD HH:mm') : '-') }
                    </div>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col sm={ 3 } componentClass={ ControlLabel }>
                    解决者
                  </Col>
                  <Col sm={ 3 }>
                    <div style={ { marginTop: '7px' } }>
                      <span>{ data['resolver'] && data['resolver'].name || '-' }</span>
                    </div>
                  </Col>
                  <Col sm={ 2 } componentClass={ ControlLabel }>
                    解决时间
                  </Col>
                  <Col sm={ 4 }>
                    <div style={ { marginTop: '7px' } }>
                      { data.resolved_at ? moment.unix(data.resolved_at).format('YYYY/MM/DD HH:mm') : '-' }
                    </div>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col sm={ 3 } componentClass={ ControlLabel }>
                    关闭者
                  </Col>
                  <Col sm={ 3 }>
                    <div style={ { marginTop: '7px' } }>
                      <span>{ data['closer'] && data['closer'].name || '-' }</span>
                    </div>
                  </Col>
                  <Col sm={ 2 } componentClass={ ControlLabel }>
                    关闭时间
                  </Col>
                  <Col sm={ 4 }>
                    <div style={ { marginTop: '7px' } }>
                      { data.closed_at ? moment.unix(data.closed_at).format('YYYY/MM/DD HH:mm') : '-' }
                    </div>
                  </Col>
                </FormGroup>

                { !data.parent_id &&
                <div className='issue-contents-diviver'>
                  <div className='issue-contents-diviver-title'>
                    子问题 
                  </div>
                  { subtaskTypeOptions.length > 0 && this.isAllowable('create_issue') &&
                  <span
                    className='comments-button issue-block-edit-button'
                    title='创建子问题'
                    onClick={ () => { this.setState({ createSubtaskModalShow: true }); } }>
                    <i className='fa fa-plus'></i>
                  </span> }
                </div> }
                { !data.parent_id && (!data.subtasks || data.subtasks.length <= 0) && 
                <div className='issue-block-emtpy'>
                  暂无子问题
                </div> }
                { !data.parent_id && data.subtasks && data.subtasks.length > 0 &&
                <FormGroup>
                  <Col sm={ 3 } componentClass={ ControlLabel }>
                    子问题 
                  </Col>
                  <Col sm={ 9 }>
                    { data.subtasks.length > 5 &&
                    <div style={ { marginTop: '7px' } }>
                      共{ data.subtasks.length }个子问题
                      <span style={ { marginLeft: '5px' } }> 
                        <a href='#' onClick={ (e) => { e.preventDefault(); this.setState({ subtaskShow: !this.state.subtaskShow }) } }>
                          { this.state.subtaskShow ? '收起' : '展开' } 
                        </a>
                      </span>
                    </div> }
                    <Table 
                      condensed 
                      hover 
                      responsive 
                      className={ (!this.state.subtaskShow && data.subtasks.length > 5) ? 'hide' : '' } 
                      style={ { marginTop: '10px', marginBottom: '0px',  borderBottom: '1px solid #ddd' } }>
                      <tbody>
                        { _.map(data.subtasks, (val, key) => (
                          <tr key={ 'subtask' + key }>
                            <td>
                              <a href='#' style={ val.state == 'Closed' ? { textDecoration: 'line-through' } : {} } onClick={ (e) => { e.preventDefault(); this.goTo(val.id); } }>
                                { val.no } - { val.title }
                              </a>
                            </td>
                            <td style={ { whiteSpace: 'nowrap', width: '10px', textAlign: 'center' } }>
                              { _.find(options.states || [], { id: val.state }) ? <span className={ 'state-' +  _.find(options.states, { id: val.state }).category  + '-label' }>{ _.find(options.states, { id: val.state }).name }</span> : '-' }
                            </td>
                          </tr>) 
                          ) }
                      </tbody>
                    </Table>
                  </Col>
                </FormGroup> }

                <div className='issue-contents-diviver'>
                  <span className='issue-contents-diviver-title'>
                    链接问题 
                  </span>
                  { this.isAllowable('link_issue') &&
                  <span
                    className='comments-button issue-block-edit-button'
                    title='创建链接'
                    onClick={ () => { this.setState({ linkIssueModalShow: true }); } }>
                    <i className='fa fa-plus'></i>
                  </span> }
                </div>
                { (!data.links || data.links.length <= 0) &&
                <div className='issue-block-emtpy'>
                  暂无链接问题
                </div> }
                { data.links && data.links.length > 0 &&
                <FormGroup>
                  <Col sm={ 3 } componentClass={ ControlLabel }>
                    链接问题 
                  </Col>
                  <Col sm={ 9 }>
                    { data.links.length > 5 &&
                    <div style={ { marginTop: '7px' } }>
                      共{ data.links.length }个问题
                      <span style={ { marginLeft: '5px' } }> 
                        <a href='#' onClick={ (e) => { e.preventDefault(); this.setState({ linkShow: !this.state.linkShow }) } }>
                          { this.state.linkShow ? '收起' : '展开' } 
                        </a>
                      </span>
                    </div> }
                    <Table 
                      condensed 
                      hover 
                      responsive 
                      className={ (!this.state.linkShow && data.links.length > 5) ? 'hide' : '' } 
                      style={ { marginTop: '10px', marginBottom: '0px', borderBottom: '1px solid #ddd' } }>
                      <tbody>
                        { _.map(data.links, (val, key) => {
                          let linkedIssue = {};
                          let relation = '';
                          let linkIssueId = ''
                          if (val.src.id == data.id) {
                            linkedIssue = val.dest;
                            relation = val.relation;
                            linkIssueId = val.dest.id;
                          } else if (val.dest.id == data.id) {
                            linkedIssue = val.src;
                            relation = val.relation;
                            const relationOutIndex = _.findIndex(options.relations || [], { out: relation });
                            if (relationOutIndex !== -1) {
                              relation = options.relations[relationOutIndex].in || '';
                            } else {
                              const relationInIndex = _.findIndex(options.relations || [], { in: relation });
                              if (relationInIndex !== -1) {
                                relation = options.relations[relationInIndex].out || '';
                              }
                            }
                            linkIssueId = val.src.id;
                          }
                          return (
                            <tr key={ 'link' + key }>
                              <td>
                                { relation }
                                <br/>
                                <a href='#' style={ linkedIssue.state == 'Closed' ? { textDecoration: 'line-through' } : {} } onClick={ (e) => { e.preventDefault(); this.goTo(linkIssueId); } }>
                                  { linkedIssue.no } - { linkedIssue.title }
                                </a>
                              </td>
                              <td style={ { whiteSpace: 'nowrap', verticalAlign: 'middle', textAlign: 'center', width: '10px' } }>
                                { _.find(options.states || [], { id: linkedIssue.state }) ? <span className={ 'state-' +  _.find(options.states, { id: linkedIssue.state }).category  + '-label' }>{ _.find(options.states, { id: linkedIssue.state }).name }</span> : '-' }
                              </td>
                              <td style={ { verticalAlign: 'middle', width: '10px', paddingRight: '8px' } }>
                                { this.isAllowable('link_issue') ? <span className='remove-icon' onClick={ this.delLink.bind(this, { title: linkedIssue.title, id: val.id }) }><i className='fa fa-trash'></i></span> : '' }
                              </td>
                            </tr>); 
                        }) }
                      </tbody>
                    </Table>
                  </Col>
                </FormGroup> }
              </Form>
            </Tab>
            <Tab eventKey={ 3 } title='改动纪录'>
              <History
                issue_id={ data.id }
                currentTime={ options.current_time || 0 }
                currentUser={ user }
                collection={ historyCollection }
                indexHistory={ indexHistory }
                sortHistory={ sortHistory }
                indexLoading={ historyIndexLoading } />
            </Tab>
            <Tab eventKey={ 2 } title={ commentsTab }>
              <Comments 
                i18n={ i18n }
                currentTime={ options.current_time || 0 }
                currentUser={ user }
                project={ project } 
                permissions={ options.permissions || [] }
                issue_id={ data.id }
                collection={ commentsCollection } 
                indexComments={ indexComments } 
                sortComments={ sortComments } 
                indexLoading={ commentsIndexLoading } 
                loading={ commentsLoading } 
                users={ options.users || [] } 
                addComments={ addComments } 
                editComments={ editComments } 
                delComments={ delComments } 
                itemLoading={ commentsItemLoading }/>
            </Tab>
            <Tab eventKey={ 4 } title={ worklogTab }>
              <Worklog 
                i18n={ i18n }
                currentTime={ options.current_time || 0 }
                currentUser={ user }
                permissions={ options.permissions || [] }
                issue={ data }
                original_estimate = { data.original_estimate }
                options={ options.timetrack || {} }
                collection={ worklogCollection } 
                indexWorklog={ indexWorklog } 
                sort={ worklogSort }
                sortWorklog={ sortWorklog } 
                indexLoading={ worklogIndexLoading } 
                loading={ worklogLoading }
                addWorklog={ addWorklog } 
                editWorklog={ editWorklog } 
                delWorklog={ delWorklog } />
            </Tab>
            { data.gitcommits_num > 0 &&
            <Tab eventKey={ 5 } title={ gitTab }>
              <GitCommits
                issue_id={ data.id }
                currentTime={ options.current_time || 0 }
                currentUser={ user }
                collection={ gitCommitsCollection }
                indexGitCommits={ indexGitCommits }
                sortGitCommits={ sortGitCommits }
                indexLoading={ gitCommitsIndexLoading } />
            </Tab> }
          </Tabs>
        </div>
        { delFileShow && 
          <DelFileModal 
            show 
            close={ this.delFileModalClose } 
            del={ delFile } 
            data={ selectedFile } 
            loading={ fileLoading }
            i18n={ i18n }/> }
        { this.state.editModalShow && 
          <CreateModal 
            show 
            close={ this.editModalClose.bind(this) } 
            options={ options } 
            edit={ edit } 
            loading={ loading } 
            project={ project } 
            data={ data } 
            isSubtask={ data.parent_id && true }
            addLabels={ addLabels }
            i18n={ i18n }/> }
        { this.state.workflowScreenShow &&
          <CreateModal 
            show
            close={ this.workflowScreenModalClose.bind(this) }
            options={ options }
            edit={ edit }
            loading={ loading }
            project={ project }
            data={ data }
            action_id={ action_id  }
            doAction={ doAction }
            isFromWorkflow={ true }
            i18n={ i18n }/> }
        { this.state.workflowCommentsShow &&
          <WorkflowCommentsModal 
            show
            close={ this.workflowCommentsModalClose.bind(this) }
            data={ data }
            action_id={ action_id  }
            doAction={ doAction }/> }
        { this.state.createSubtaskModalShow && 
          <CreateModal 
            show 
            close={ this.createSubtaskModalClose.bind(this) } 
            options={ options } 
            create={ create } 
            loading={ loading } 
            project={ project } 
            parent={ data } 
            isSubtask={ true }
            i18n={ i18n }/> }
        { this.state.previewModalShow && 
          <PreviewModal 
            show 
            close={ () => { this.setState({ previewModalShow: false }); } } 
            state={ data.state }
            collection={ wfCollection } /> }
        { this.state.linkIssueModalShow && 
          <LinkIssueModal 
            show 
            close={ () => { this.setState({ linkIssueModalShow: false }); } } 
            options={ options } 
            loading={ linkLoading } 
            createLink={ createLink } 
            issue={ data } 
            types={ options.types } 
            project={ project }
            i18n={ i18n }/> }
        { this.state.delLinkModalShow && 
          <DelLinkModal 
            show 
            close={ () => { this.setState({ delLinkModalShow: false }); } } 
            loading={ linkLoading } 
            delLink={ delLink } 
            data={ this.state.delLinkData }
            i18n={ i18n }/> }
        { this.state.convertTypeModalShow &&
          <ConvertTypeModal 
            show
            close={ () => { this.setState({ convertTypeModalShow: false }); } }
            options={ options }
            convert={ convert }
            loading={ loading }
            issue={ data }
            i18n={ i18n }/> }
        { this.state.convertType2ModalShow &&
          <ConvertType2Modal 
            show
            close={ () => { this.setState({ convertType2ModalShow: false }); } }
            options={ options }
            project={ project }
            convert={ convert }
            loading={ loading }
            issue={ data }
            i18n={ i18n }/> }
        { this.state.moveModalShow &&
          <MoveModal 
            show
            close={ () => { this.setState({ moveModalShow: false }); } }
            options={ options }
            project={ project }
            move={ move }
            loading={ loading }
            issue={ data }
            i18n={ i18n }/> }
        { this.state.assignModalShow &&
          <AssignModal 
            show
            close={ () => { this.setState({ assignModalShow: false }); } }
            options={ options }
            setAssignee={ setAssignee }
            issue={ data }
            i18n={ i18n }/> }
        { this.state.setLabelsModalShow &&
          <SetLabelsModal 
            show
            close={ () => { this.setState({ setLabelsModalShow: false }); } }
            options={ options }
            setLabels={ setLabels }
            addLabels={ addLabels }
            issue={ data }
            i18n={ i18n }/> }
        { this.state.shareModalShow &&
          <ShareLinkModal 
            show
            project={ project }
            close={ () => { this.setState({ shareModalShow: false }); } }
            issue={ data }/> }
        { this.state.resetModalShow &&
          <ResetStateModal 
            show
            close={ () => { this.setState({ resetModalShow: false }); } }
            options={ options }
            resetState={ resetState }
            issue={ data }
            i18n={ i18n }/> }
        { this.state.delNotifyShow &&
          <DelNotify 
            show
            close={ () => { this.setState({ delNotifyShow: false }) } }
            data={ data }
            del={ del }
            detailClose={ close }
            i18n={ i18n }/> }
        { this.state.copyModalShow &&
          <CopyModal 
            show
            close={ () => { this.setState({ copyModalShow: false }); } }
            options={ options }
            loading={ loading }
            copy={ copy }
            data={ data }
            i18n={ i18n }/> }
        { this.state.watchersModalShow &&
          <WatcherListModal 
            show
            close={ () => { this.setState({ watchersModalShow: false }); } }
            issue_no={ data.no }
            watchers={ data.watchers || [] }
            i18n={ i18n }/> }
        { this.state.periodModalShow &&
          <PeriodEditModal
            show
            close={ () => { this.setState({ periodModalShow: false }); } }
            edit={ edit }
            data={ data }
            i18n={ i18n }/> }

      </div>
    );
  }
}
