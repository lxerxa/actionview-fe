import React, { PropTypes, Component } from 'react';
import { Modal, Button, ControlLabel, Label, Grid, Row, Col, Table, Tabs, Tab, Form, FormGroup, DropdownButton, MenuItem, ButtonToolbar, ButtonGroup } from 'react-bootstrap';
import DropzoneComponent from 'react-dropzone-component';
import Lightbox from 'react-image-lightbox';
import Select from 'react-select';
import _ from 'lodash';

const moment = require('moment');
const CreateModal = require('./CreateModal');
const Comments = require('./comments/Comments');
const History = require('./history/History');
const img = require('../../assets/images/loading.gif');
const PreviewModal = require('../workflow/PreviewModal');
const DelFileModal = require('./DelFileModal');

export default class DetailBar extends Component {
  constructor(props) {
    super(props);
    this.state = { tabKey: 1, delFileShow: false, selectedFile: {}, previewShow: false, photoIndex: 0, editAssignee: false, settingAssignee: false, editModalShow: false, previewModalShow: false };
    this.delFileModalClose = this.delFileModalClose.bind(this);
    this.uploadSuccess = this.uploadSuccess.bind(this);
  }

  static propTypes = {
    options: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    record: PropTypes.func.isRequired,
    forward: PropTypes.func.isRequired,
    visitedIndex: PropTypes.number.isRequired, 
    visitedCollection: PropTypes.array.isRequired,
    issueCollection: PropTypes.array.isRequired,
    show: PropTypes.func.isRequired,
    wfCollection: PropTypes.array.isRequired,
    wfLoading: PropTypes.bool.isRequired,
    viewWorkflow: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    fileLoading: PropTypes.bool.isRequired,
    delFile: PropTypes.func.isRequired,
    addFile: PropTypes.func.isRequired,
    setAssignee: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
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
    worklogItemLoading: PropTypes.bool.isRequired,
    worklogLoaded: PropTypes.bool.isRequired,
    indexHistory: PropTypes.func.isRequired,
    historyCollection: PropTypes.array.isRequired,
    historyIndexLoading: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.itemLoading) {
      this.setState({ tabKey: 1, editAssignee: false });
    }
  }

  handleTabSelect(tabKey) {
    const { indexComments, indexHistory, commentsLoaded } = this.props;
    this.setState({ tabKey });
    if (tabKey === 2 && !commentsLoaded) {
      indexComments();
    } else if (tabKey === 3) {
      indexHistory();
    }
  }

  delFileNotify(field_key, id, name) {
    const { data } = this.props;
    this.setState({ delFileShow: true, selectedFile: { field_key, id, name } });
  }

  delFileModalClose() {
    this.setState({ delFileShow: false });
  }

  uploadSuccess(localfile, res) {
    const { field = '', file = {} } = res.data;
    const { addFile } = this.props;
    addFile(field, file); 
  }

  openPreview(index) {
    this.setState({ previewShow: true, photoIndex: index });
  }

  async viewWorkflow(e) {
    e.preventDefault();
    const { viewWorkflow } = this.props;
    const ecode = await viewWorkflow();
    if (ecode === 0) {
      this.setState({ previewModalShow: true });
    }
  }

  async assignToMe(e) {
    e.preventDefault();
    const { setAssignee } = this.props;
    const ecode = await setAssignee({ assignee: '57afced21d41c8174d7421c1' });
    // fix me
    //if (ecode === 0) {
    //} else {
    //}
  }

  editAssignee() {
    this.setState({ editAssignee: true });
  }

  async setAssignee() {
    this.setState({ settingAssignee: true });
    const { setAssignee } = this.props;
    const ecode = await setAssignee({ assignee: this.state.newAssignee });
    if (ecode === 0) {
      this.setState({ settingAssignee: false, editAssignee: false, newAssignee: undefined });
    } else {
      this.setState({ settingAssignee: false });
    }
  }

  cancelSetAssignee() {
    this.setState({ editAssignee: false, newAssignee: undefined });
  }

  handleAssigneeSelectChange(value) {
    this.setState({ newAssignee: value });
  }

  editModalClose() {
    this.setState({ editModalShow: false });
  }

  getFileIconCss(fileName) {
    const newFileName = (fileName || '').toLowerCase();
    if (_.endsWith(newFileName, 'doc') || _.endsWith(newFileName, 'docx')) {
      return 'fa fa-file-word-o';
    } else if (_.endsWith(newFileName, 'xls') || _.endsWith(newFileName, 'xlsx')) {
      return 'fa fa-file-excel-o';
    } else if (_.endsWith(newFileName, 'ppt') || _.endsWith(newFileName, 'pptx')) {
      return 'fa fa-file-powerpoint-o';
    } else if (_.endsWith(newFileName, 'pdf')) {
      return 'fa fa-file-pdf-o';
    } else if (_.endsWith(newFileName, 'txt')) {
      return 'fa fa-file-text-o';
    } else if (_.endsWith(newFileName, 'zip') || _.endsWith(newFileName, 'rar') || _.endsWith(newFileName, '7z') || _.endsWith(newFileName, 'gz') || _.endsWith(newFileName, 'bz')) {
      return 'fa fa-file-zip-o';
    } else {
      return 'fa fa-file-o';
    }
  }

  async next(curInd) {
    const { show, record, issueCollection=[] } = this.props;
    if (curInd < issueCollection.length - 1) {
      const nextInd = _.add(curInd, 1);
      const nextId = issueCollection[nextInd].id;
      const ecode = await show(nextId);
      if (ecode == 0) {
        record();
      }
    }
  }

  async previous(curInd) {
    const { show, record, issueCollection=[] } = this.props;
    if (curInd > 0 ) {
      const nextId = issueCollection[curInd - 1].id;
      const ecode = await show(nextId);
      if (ecode == 0) {
        record();
      }
    }
  }

  async forward(offset) {
    const { show, forward, visitedIndex, visitedCollection=[] } = this.props;
    const forwardIndex = _.add(visitedIndex, offset);
    if (visitedCollection[ forwardIndex ]) {
      const ecode = await show(visitedCollection[ forwardIndex ]);
      if (ecode == 0) {
        forward(offset);
      }
    }
  }

  render() {
    const { close, data={}, record, visitedIndex, visitedCollection, issueCollection=[], loading, itemLoading, options, project, fileLoading, delFile, edit, wfCollection, wfLoading, indexComments, commentsCollection, commentsIndexLoading, commentsLoading, commentsItemLoading, addComments, editComments, delComments, indexHistory, historyCollection, historyIndexLoading } = this.props;
    const { previewShow, photoIndex, newAssignee, settingAssignee, editAssignee, delFileShow, selectedFile } = this.state;

    const assigneeOptions = _.map(options.users || [], (val) => { return { label: val.nameAndEmail, value: val.id } });

    const type = _.find(options.types, { id : data.type });
    const schema = type && type.schema ? type.schema : [];

    const curInd = _.findIndex(issueCollection, { id: data.id });

    return (
      <div className='animate-dialog'>
        <Button className='close' onClick={ close } title='关闭'>
          <i className='fa fa-close'></i>
        </Button>
        <Button className='angle' onClick={ this.next.bind(this, curInd) } disabled={ curInd < 0 || curInd >= issueCollection.length - 1 } title='下一个'>
          <i className='fa fa-angle-down'></i>
        </Button>
        <Button className='angle' onClick={ this.previous.bind(this, curInd) } disabled={ curInd <= 0 } title='上一个'>
          <i className='fa fa-angle-up'></i>
        </Button>
        <Button className='angle' onClick={ this.forward.bind(this, 1) } disabled={ visitedIndex < 0 || visitedIndex >= visitedCollection.length - 1 } title='前进'>
          <i className='fa fa-angle-right'></i>
        </Button>
        <Button className='angle' onClick={ this.forward.bind(this, -1) } disabled={ visitedIndex <= 0 } title='后退'>
          <i className='fa fa-angle-left'></i>
        </Button>
        <div className='panel panel-default'>
          <Tabs activeKey={ this.state.tabKey } onSelect={ this.handleTabSelect.bind(this) } id='uncontrolled-tab-example'>
            <Tab eventKey={ 1 } title='基本'>
              <div className='detail-view-blanket' style={ { display: itemLoading ? 'block' : 'none' } }><img src={ img } className='loading detail-loading'/></div>
              <Form horizontal className={ itemLoading && 'hide' } style={ { marginRight: '5px' } }>
                <ButtonToolbar style={ { margin: '10px 10px 10px 5px' } }>
                  <Button onClick={ () => { this.setState({ editModalShow: true }) } }><i className='fa fa-pencil'></i> 编辑</Button>
                  <ButtonGroup style={ { marginLeft: '10px' } }>
                  { _.map(data.wfactions || [], (v, i) => {
                    return ( <Button key={ i }>{ v.name }</Button> ); 
                  }) }
                  </ButtonGroup>
                  <div style={ { float: 'right' } }>
                    <DropdownButton pullRight bsStyle='link' title='更多'>
                      <MenuItem eventKey='2'>刷新</MenuItem>
                    </DropdownButton>
                  </div>
                </ButtonToolbar>
                <FormGroup controlId='formControlsLabel'>
                  <Col sm={ 3 } componentClass={ ControlLabel }>
                    类型/NO 
                  </Col>
                  <Col sm={ 3 }>
                    <div style={ { marginTop: '6px' } }>{ type ? type.name : '-' }/{ data.no || '' }</div>
                  </Col>
                  <Col sm={ 2 } componentClass={ ControlLabel }>
                    状态
                  </Col>
                  <Col sm={ 4 }>
                    <div style={ { marginTop: '6px' } }><Label>{ _.find(options.states || [], { id: data.state }) ? _.find(options.states, { id: data.state }).name : '-' }</Label>{ !wfLoading ? <a href='#' onClick={ this.viewWorkflow.bind(this) }><span style={ { marginLeft: '5px' } }>查看</span></a> : <img src={ img } className='small-loading'/> }</div>
                  </Col>
                </FormGroup>
                { _.map(schema, (field, key) => {
                  if (field.type !== 'File' && field.key !== 'assignee' && !data[field.key]) {
                    return;
                  }

                  let contents = '';
                  if (field.key === 'assignee') {
                    contents = (
                      !editAssignee ?
                      <div>
                        <div className='editable-list-field' style={ { display: 'table', width: '100%' } }>
                          <span>
                            <div style={ { display: 'inline-block', float: 'left', margin: '3px' } }>
                              { data[field.key] && data[field.key].name || '-' }
                            </div>
                          </span>
                          <span className='edit-icon-zone edit-icon' onClick={ this.editAssignee.bind(this) }><i className='fa fa-pencil'></i></span>
                        </div>
                        <span style={ { float: 'left' } }><a href='#' onClick={ this.assignToMe.bind(this) }>分配给我</a></span>
                      </div>
                      :
                      <div>
                        <Select simpleValue clearable={ false } disabled={ settingAssignee } options={ assigneeOptions } value={ newAssignee || data[field.key].id } onChange={ this.handleAssigneeSelectChange.bind(this) } placeholder='选择经办人'/>
                        <div style={ { float: 'right' } }>
                          <Button className='edit-ok-button' onClick={ this.setAssignee.bind(this) }><i className='fa fa-check'></i></Button>
                          <Button className='edit-ok-button' onClick={ this.cancelSetAssignee.bind(this) }><i className='fa fa-close'></i></Button>
                        </div>
                      </div>
                    );
                  } else if (field.type === 'Select' || field.type === 'RadioGroup' || field.type === 'SingeVersion') {
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
                    contents = newValues.join(',') || '-';
                  } else if (field.type === 'DatePicker') {
                    contents = moment.unix(data[field.key]).format('YYYY/MM/DD');
                  } else if (field.type === 'DateTimePicker') {
                    contents = moment.unix(data[field.key]).format('YYYY/MM/DD HH:mm');
                  } else if (field.type === 'File') {
                    const componentConfig = {
                      showFiletypeIcon: true,
                      postUrl: '/api/project/' + project.key + '/file?issue_id=' + data.id 
                    };
                    const djsConfig = {
                      addRemoveLinks: false,
                      paramName: field.key,
                      maxFilesize: 20
                    };
                    const eventHandlers = {
                      init: dz => this.dropzone = dz,
                      success: (localfile, response) => { this.uploadSuccess(localfile, response); this.dropzone.removeFile(localfile); }
                    };

                    const imgFiles = _.filter(data[field.key], (f) => { return _.indexOf([ 'image/jpeg', 'image/jpg', 'image/png', 'image/gif' ], f.type) !== -1 });
                    const noImgFiles = _.filter(data[field.key], (f) => { return _.indexOf([ 'image/jpeg', 'image/jpg', 'image/png', 'image/gif' ], f.type) === -1 });
                    contents = (<div>
                      { noImgFiles.length > 0 &&
                        <Table condensed hover responsive>
                          <tbody>
                            { _.map(noImgFiles, (f, i) => 
                              <tr key={ i }>
                                <td><i className={ this.getFileIconCss(f.name) }></i> <a href={ '/api/project/' + project.key + '/file/' + f.id } download={ f.name }>{ f.name }</a></td>
                                <td width='2%'><span className='remove-icon' onClick={ this.delFileNotify.bind(this, field.key, f.id, f.name) }><i className='fa fa-trash'></i></span></td>
                              </tr> ) }
                          </tbody>
                        </Table> }

                      { imgFiles.length > 0 && 
                         <Grid style={ { paddingLeft: '0px' } }>
                           <Row>
                           { _.map(imgFiles, (f, i) =>
                             <Col sm={ 6 } key={ i }>
                               <div className='attachment-content'>
                                 <div className='attachment-thumb' onClick={ this.openPreview.bind(this, i) }>
                                   <img src={  '/api/project/' + project.key + '/file/' + f.id + '?flag=s' }/>
                                 </div>
                                 <div className='attachment-title-container'>
                                    <div className='attachment-title'>{ f.name }</div>
                                    <div className='remove-icon' onClick={ this.delFileNotify.bind(this, field.key, f.id, f.name) }><i className='fa fa-trash'></i></div>
                                 </div>
                               </div>
                             </Col> ) }
                           </Row>
                         </Grid> }
                      <div style={ { marginTop: '8px' } }>
                        <DropzoneComponent 
                          config={ componentConfig } 
                          eventHandlers={ eventHandlers } 
                          djsConfig={ djsConfig } />
                      </div>
                      { previewShow &&
                        <Lightbox
                          mainSrc={  '/api/project/' + project.key + '/file/' + imgFiles[photoIndex].id }
                          nextSrc={  '/api/project/' + project.key + '/file/' + imgFiles[(photoIndex + 1) % imgFiles.length].id }
                          prevSrc={  '/api/project/' + project.key + '/file/' + imgFiles[(photoIndex + imgFiles.length - 1) % imgFiles.length].id }
                          imageTitle={ imgFiles[photoIndex].name }
                          imageCaption={ imgFiles[photoIndex].uploader.name + ' 上传于 ' + imgFiles[photoIndex].created_at }
                          onCloseRequest={ () => this.setState({ previewShow: false }) }
                          onMovePrevRequest={ () => this.setState({ photoIndex: (photoIndex + imgFiles.length - 1) % imgFiles.length }) }
                          onMoveNextRequest={ () => this.setState({ photoIndex: (photoIndex + 1) % imgFiles.length }) } /> }
                    </div>);
                  } else if (field.type === 'TextArea') {
                    contents = ( <span dangerouslySetInnerHTML={ { __html: data[field.key].replace(/(\r\n)|(\n)/g, '<br/>') } } /> ); 
                  } else {
                    contents = data[field.key];
                  }
                  return (
                    <FormGroup controlId='formControlsLabel' key={ 'form-' + key }>
                      <Col sm={ 3 } componentClass={ ControlLabel }>
                        { field.name || '-' }
                      </Col>
                      <Col sm={ 9 }>
                        <div style={ { marginTop: '6px' } }>
                          { contents }
                        </div>
                      </Col>
                    </FormGroup>
                  );
                }) }
              </Form>
            </Tab>
            <Tab eventKey={ 2 } title='备注'>
              <Comments collection={ commentsCollection } indexComments={ indexComments } indexLoading={ commentsIndexLoading } loading={ commentsLoading } users={ options.users || [] } addComments={ addComments } editComments={ editComments } delComments={ delComments } itemLoading={ commentsItemLoading }/>
            </Tab>
            <Tab eventKey={ 3 } title='改动纪录'>
              <History collection={ historyCollection } indexHistory={ indexHistory } indexLoading={ historyIndexLoading } />
            </Tab>
            <Tab eventKey={ 4 } title='工作日志'>Tab 3 content</Tab>
          </Tabs>
        </div>
        { delFileShow && <DelFileModal show close={ this.delFileModalClose } del={ delFile } data={ selectedFile } loading={ fileLoading }/> }
        { this.state.editModalShow && <CreateModal show close={ this.editModalClose.bind(this) } options={ options } edit={ edit } loading={ loading } project={ project } data={ data }/> }
        { this.state.previewModalShow && <PreviewModal show close={ () => { this.setState({ previewModalShow: false }); } } collection={ wfCollection } /> }
      </div>
    );
  }
}
