import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { FormGroup, FormControl, ButtonGroup, Button, Breadcrumb, DropdownButton, MenuItem } from 'react-bootstrap';
import Select from 'react-select';
import DropzoneComponent from 'react-dropzone-component';
import _ from 'lodash';
import { notify } from 'react-notify-toast';
import { getFileIconCss } from '../share/Funcs';

const $ = require('$');
const moment = require('moment');
const DelNotify = require('./DelNotify');
const CopyModal = require('./CopyModal');
const MoveModal = require('./MoveModal');
const EditRow = require('./EditRow');
const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      copyModalShow: false,
      moveModalShow: false,
      delNotifyShow: false, 
      operateShow: false, 
      hoverRowId: '', 
      editRowId: '',
      createFolderShow: false,
      uploader_id: null,
      name: '' 
    };

    this.state.sortkey = window.localStorage && window.localStorage.getItem('document-sortkey') || 'create_time_desc';

    this.delNotifyClose = this.delNotifyClose.bind(this);
    this.refresh = this.refresh.bind(this);
    this.uploadSuccess = this.uploadSuccess.bind(this);
    this.cancelEditRow = this.cancelEditRow.bind(this);
    this.initEditRow = this.initEditRow.bind(this);
    this.downloadAll = this.downloadAll.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    project_key: PropTypes.string.isRequired,
    directory: PropTypes.string.isRequired,
    options: PropTypes.object,
    collection: PropTypes.array.isRequired,
    selectedItem: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired,
    addFile: PropTypes.func.isRequired,
    sort: PropTypes.func.isRequired,
    createFolder: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    copy: PropTypes.func.isRequired,
    move: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index, query={} } = this.props;
    const newQuery = {};
    if (query.uploader_id) {
      newQuery.uploader_id = this.state.uploader_id = query.uploader_id;
    }
    if (query.name) {
      newQuery.name = this.state.name = query.name;
    }
    index(newQuery);
  }

  cancelEditRow() {
    this.setState({ 
      editRowId: '',
      createFolderShow: false });
  }

  initEditRow() {
    this.state.editRowId = '';
    this.state.createFolderShow = false;
  }

  delNotifyClose() {
    this.setState({ delNotifyShow: false });
  }

  edit(id) {
    this.setState({ editModalShow: true });
    const { select } = this.props;
    select(id);
  }

  componentDidMount() {
    const self = this;
    $('#pname').bind('keypress',function(event){  
      if(event.keyCode == '13') {  
        self.refresh();
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const newQuery = nextProps.query || {};
    const { directory, index, query } = this.props;
    if (!_.isEqual(newQuery, query) || !_.isEqual(directory, nextProps.directory)) {
      index(newQuery);
      this.initEditRow();
    }

    this.state.uploader_id = newQuery.uploader_id || null;
    this.state.name = newQuery.name || '';
  }

  delNotify(id) {
    this.setState({ delNotifyShow: true });
    const { select } = this.props;
    select(id);
  }

  async operateSelect(eventKey) {
    const { hoverRowId } = this.state;
    const { select, project_key } = this.props;
    await select(hoverRowId);

    if (eventKey === 'rename') {
      this.setState({ editRowId: hoverRowId });
    } else if (eventKey === 'copy') {
      this.setState({ copyModalShow: true });
    } else if (eventKey === 'move') {
      this.setState({ moveModalShow: true });
    } else if (eventKey === 'del') {
      this.setState({ delNotifyShow: true });
    } else if (eventKey === 'download') {
      const url = '/api/project/' + project_key + '/document/' + hoverRowId + '/download';
      window.open(url, '_blank');
    }
  }

  downloadAll() {
    const { project_key, directory } = this.props;
    const url = '/api/project/' + project_key + '/document/' + directory + '/download';
    window.open(url, '_blank');
  }

  onRowMouseOver(rowData) {
    if (rowData.id !== this.state.hoverRowId) {
      this.setState({ operateShow: true, hoverRowId: rowData.id });
    }
  }

  onMouseLeave() {
    this.setState({ operateShow: false, hoverRowId: '' });
  }

  refresh() {
    const { refresh } = this.props;
    const query = {};
    if (this.state.uploader_id) {
      query.uploader_id = this.state.uploader_id;
    }
    if (this.state.uploaded_at) {
      query.uploaded_at = this.state.uploaded_at;
    }
    if (_.trim(this.state.name)) {
      query.name = _.trim(this.state.name);
    }
    refresh(query);
  }

  uploaderChange(newValue) {
    this.state.uploader_id = newValue;
    this.refresh();
  }

  uploadedAtChange(newValue) {
    this.state.uploaded_at = newValue;
    this.refresh();
  }

  sortChange(newValue) {
    if (window.localStorage) {
      window.localStorage.setItem('document-sortkey', newValue);
    }
    this.setState({ sortkey: newValue });
    const { sort } = this.props;
    sort(newValue);
  }

  uploadSuccess(localfile, res) {
    const { addFile } = this.props;
    if (res.ecode === 0 && res.data) {
      addFile(res.data);
    } else {
      notify.show('文档上传失败。', 'error', 2000);
    }
  }

  getFileSize(bytes) {
    const K = 1024;
    const M = 1024 * 1024;
    const G = 1024 * 1024 * 1024;
    if (bytes < K/10) {
      return bytes + 'B';
    } else if (bytes < M/10) {
      return _.ceil(bytes/K, 1) + 'K';
    } else if (bytes < G/10) {
      return _.ceil(bytes/M, 1) + 'M';
    } else {
      return _.ceil(bytes/G, 1) + 'G';
    }
  }

  render() {
    const { 
      i18n, 
      user,
      project_key,
      directory,
      collection, 
      selectedItem, 
      loading, 
      indexLoading, 
      itemLoading, 
      refresh, 
      createFolder, 
      del, 
      update, 
      copy, 
      move, 
      options, 
      query } = this.props;
    const { createFolderShow, editRowId, hoverRowId, operateShow } = this.state;

    const uploadedat_options = [
      { value: '1w', label: '1周内' },
      { value: '2w', label: '2周内' },
      { value: '1m', label: '1个月内' },
      { value: '2m', label: '2个月内' }
    ];

    const sortOptions = [
      { value: 'create_time_asc', label: '创建时间 ↑' },
      { value: 'create_time_desc', label: '创建时间 ↓' },
      { value: 'name_asc', label: '名称 ↑' },
      { value: 'name_desc', label: '名称 ↓' }
    ];

    const componentConfig = {
      showFiletypeIcon: true,
      postUrl: '/api/project/' + project_key + '/document/' + (directory ? (directory + '/') : '') + 'upload'
    };
    const djsConfig = {
      addRemoveLinks: true
    };
    const eventHandlers = {
      init: dz => this.dropzone = dz,
      success: (localfile, response) => { this.uploadSuccess(localfile, response); this.dropzone.removeFile(localfile); }, 
      error: (localfile) => { notify.show('文档上传失败。', 'error', 2000); this.dropzone.removeFile(localfile); }
    }

    const node = ( <span><i className='fa fa-cog'></i></span> );

    const rows = [];
    if (!indexLoading && options.path && options.path.length > 1 && _.isEmpty(query)) {
      const parent = options.path[options.path.length - 2];
      rows.push({ 
        id: parent.id,
        name: (
          <div>
            <span style={ { marginRight: '5px', color: '#FFD300' } }><i className='fa fa-arrow-up'></i></span>
            <Link to={ '/project/' + project_key + '/document' + (parent.id !== '0' ? ( '/' + parent.id ) : '') }>返回上级</Link>
          </div> ),
        operation: (<div/>)
      });
    }

    if (createFolderShow) {
      rows.push({
        id: 'createFolder',
        name: 
          <EditRow 
            i18n={ i18n }
            loading={ itemLoading }
            data={ {} } 
            createFolder={ createFolder }
            collection={ collection } 
            cancel={ this.cancelEditRow } 
            mode='createFolder'/>, 
        operation: (<div/>)
      });
    }

    const directories = _.filter(collection, { d: 1 });
    _.map(directories, (v, i) => {
      if (editRowId == v.id) {
        rows.push({
          id: v.id,
          name: 
            <EditRow 
              i18n={ i18n }
              loading={ itemLoading }
              data={ selectedItem } 
              collection={ collection } 
              edit={ update }
              cancel={ this.cancelEditRow } 
              mode='editFolder'/>, 
          operation: (<div/>)
        });
        return;
      }
      rows.push({
        id: v.id,
        name: (
          <div>
            <span style={ { marginRight: '5px', color: '#FFD300' } }><i className='fa fa-folder'></i></span>
            <Link to={ '/project/' + project_key + '/document/' + v.id }>{ v.name }</Link>
          </div> ),
        operation: (
          <div>
          { operateShow && hoverRowId === v.id && !itemLoading &&
            <DropdownButton
              pullRight
              bsStyle='link'
              style={ { textDecoration: 'blink' ,color: '#000' } }
              key={ i }
              title={ node }
              id={ `dropdown-basic-${i}` }
              onClick={ this.cancelEditRow }
              onSelect={ this.operateSelect.bind(this) }>
              <MenuItem eventKey='download'>下载</MenuItem>
              { options.permissions && options.permissions.indexOf('manage_project') !== -1 && <MenuItem eventKey='rename'>重命名</MenuItem> } 
              { options.permissions && options.permissions.indexOf('manage_project') !== -1 && <MenuItem eventKey='move'>移动</MenuItem> }
              { options.permissions && options.permissions.indexOf('manage_project') !== -1 && <MenuItem eventKey='del'>删除</MenuItem> }
            </DropdownButton> }
            <img src={ img } className={ (itemLoading && selectedItem.id === v.id) ? 'loading' : 'hide' }/>
          </div>)
      });      
    });

    const files = _.reject(collection, { d: 1 });
    const fileNum = files.length;
    for (let i = 0; i < fileNum; i++) {
      const iconCss = getFileIconCss(files[i].name);

      if (editRowId == files[i].id) {
        rows.push({
          id: files[i].id,
          name: 
            <EditRow 
              i18n={ i18n }
              loading={ itemLoading }
              data={ selectedItem } 
              collection={ collection } 
              edit={ update }
              cancel={ this.cancelEditRow } 
              mode='editFile' 
              fileIconCss={ iconCss }/>,
          operation: (<div/>)
        });
        continue;
      }

      rows.push({
        id: files[i].id,
        name: ( 
          <div> 
            <span style={ { marginRight: '5px', color: '#777', float: 'left' } }><i className={ iconCss }></i></span>
            <a href={ '/api/project/' + project_key + '/document/' + files[i].id + '/download' } download={ files[i].name } style={ { cursor: 'pointer' } }>
              { files[i].name }
            </a>
            <span style={ { float: 'right' } }>
              { files[i].parent != directory && 
              <Link to={ '/project/' + project_key + '/document' + (files[i].parent == '0' ? '' : ('/' + files[i].parent) ) }><span style={ { marginRight: '15px', float: 'left' } }>打开目录</span></Link> }
              { files[i].uploader &&
              <span style={ { marginRight: '15px', float: 'left' } }>
                { files[i].uploader.name + '  ' + moment.unix(files[i].uploaded_at).format('YYYY/MM/DD HH:mm') }
              </span> }
              <span style={ { float: 'left' } }>{ this.getFileSize(files[i].size) }</span>
            </span>
          </div> ),
        operation: (
          <div>
          { operateShow && hoverRowId === files[i].id && !itemLoading &&
            <DropdownButton 
              pullRight 
              bsStyle='link' 
              style={ { textDecoration: 'blink' ,color: '#000' } } 
              key={ i } 
              title={ node } 
              id={ `dropdown-basic-${i}` } 
              onClick={ this.cancelEditRow }
              onSelect={ this.operateSelect.bind(this) }>
              <MenuItem eventKey='download'>下载</MenuItem>
              { options.permissions && (options.permissions.indexOf('manage_project') !== -1 || files[i].uploader.id == user.id) && <MenuItem eventKey='rename'>重命名</MenuItem> }
              { options.permissions && (options.permissions.indexOf('manage_project') !== -1 || files[i].uploader.id == user.id) && <MenuItem eventKey='move'>移动</MenuItem> }
              { options.permissions && (options.permissions.indexOf('manage_project') !== -1 || files[i].uploader.id == user.id) && <MenuItem eventKey='del'>删除</MenuItem> }
            </DropdownButton> }
            <img src={ img } className={ (itemLoading && selectedItem.id === files[i].id) ? 'loading' : 'hide' }/>
          </div>
        )
      });
    }

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
        <div style={ { marginTop: '5px', height: '40px' } }>
          <FormGroup>
            <span style={ { float: 'left', fontSize: '16px' } }>
              <Breadcrumb style={ { marginBottom: '0px', backgroundColor: '#fff', paddingLeft: '5px', marginTop: '0px' } }>
                { _.map(options.path || [], (v, i) => {
                  if (i === options.path.length - 1) {
                    return (<Breadcrumb.Item active key={ i }>{ i === 0 ? '根目录' : v.name }</Breadcrumb.Item>);
                  } else if (i === 0) {
                    return (<Breadcrumb.Item key={ i } disabled={ indexLoading }><Link to={ '/project/' + project_key + '/document' }>根目录</Link></Breadcrumb.Item>);
                  } else {
                    return (<Breadcrumb.Item key={ i } disabled={ indexLoading }><Link to={ '/project/' + project_key + '/document/' + v.id }>{ v.name }</Link></Breadcrumb.Item>);
                  }
                }) }
              </Breadcrumb>
            </span>
            <span style={ { float: 'right', width: '120px', marginRight: '10px' } }>
              <Select
                simpleValue
                placeholder='默认顺序'
                value={ this.state.sortkey }
                onChange={ this.sortChange.bind(this) }
                clearable={ false }
                options={ sortOptions }/>
            </span>
            <span style={ { float: 'right', width: '18%', marginRight: '10px' } }>
              <FormControl
                type='text'
                id='pname'
                style={ { height: '36px' } }
                value={ this.state.name }
                onChange={ (e) => { this.setState({ name: e.target.value }) } }
                placeholder={ '文档名称查询...' } />
            </span>
            <span style={ { float: 'right', width: '120px', marginRight: '10px' } }>
              <Select
                simpleValue
                placeholder='上传时间'
                value={ this.state.uploaded_at }
                onChange={ this.uploadedAtChange.bind(this) }
                options={ uploadedat_options }/>
            </span>
            <span style={ { float: 'right', width: '12%', marginRight: '10px' } }>
              <Select
                simpleValue
                placeholder='上传者'
                value={ this.state.uploader_id }
                onChange={ this.uploaderChange.bind(this) }
                options={ _.map(options.uploader || [], (v) => { return { value: v.id, label: v.name } }) }/>
            </span>
            { options.permissions && options.permissions.indexOf('manage_project') !== -1 &&
            <span style={ { float: 'right', marginRight: '10px' } }>
              <Button onClick={ () => { this.cancelEditRow(); this.setState({ createFolderShow: true }); } } style={ { height: '36px' } } disabled={ indexLoading || itemLoading || !_.isEmpty(query) }>
                <i className='fa fa-plus'></i>&nbsp;新建目录
              </Button>
            </span> }
          </FormGroup>
        </div>
        <div>
          <BootstrapTable data={ rows } bordered={ false } hover options={ opts } trClassName='tr-middle'>
            <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
            <TableHeaderColumn dataField='name'>名称</TableHeaderColumn>
            <TableHeaderColumn width='60' dataField='operation'/>
          </BootstrapTable>
          <div style={ { marginTop: '15px' } }>
            <DropzoneComponent style={ { height: '200px' } } config={ componentConfig } eventHandlers={ eventHandlers } djsConfig={ djsConfig } />
          </div>
          <div style={ { marginLeft: '5px', marginTop: '15px', marginBottom: '20px' } }>
            { !indexLoading && collection.length > 0 && <span>共计 文件夹 { _.filter(collection, { d: 1 }).length } 个，文件 { _.reject(collection, { d: 1 }).length } 个。</span> }
            { collection.length > 1 && _.isEmpty(query) && options.path.length > 1 && 
            <span style={ { marginLeft: '10px' } }>
              <i className='fa fa-download'></i>
              <a href='#' onClick={ (e) => { e.preventDefault(); this.downloadAll(); } }>下载全部</a>
            </span> }
          </div>
          { this.state.copyModalShow &&
          <CopyModal 
            show
            project_key={ project_key }
            close={ () => { this.setState({ copyModalShow: false }); } }
            copy={ copy }
            data={ selectedItem }
            i18n={ i18n }/> }
          { this.state.moveModalShow &&
          <MoveModal
            show
            project_key={ project_key }
            close={ () => { this.setState({ moveModalShow: false }); } }
            move={ move }
            data={ selectedItem }
            i18n={ i18n }/> }
          { this.state.delNotifyShow &&
          <DelNotify
            show
            close={ this.delNotifyClose }
            data={ selectedItem }
            del={ del }
            i18n={ i18n }/> }
        </div>
      </div>
    );
  }
}
