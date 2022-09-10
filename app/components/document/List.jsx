import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { FormGroup, FormControl, Button, DropdownButton, MenuItem } from 'react-bootstrap';
import DropzoneComponent from 'react-dropzone-component';
import Lightbox from 'react-image-lightbox';
import _ from 'lodash';
import { notify } from 'react-notify-toast';
import { getFileIconCss, urlWrapper } from '../share/Funcs';

const $ = require('$');
const moment = require('moment');
const DelNotify = require('./DelNotify');
const CopyModal = require('./CopyModal');
const MoveModal = require('./MoveModal');
const EditRow = require('./EditRow');
const BackTop = require('../share/BackTop');
const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      copyModalShow: false,
      moveModalShow: false,
      delNotifyShow: false, 
      operateShow: false, 
      photoIndex: 0,
      imgPreviewShow: false,
      hoverRowId: '', 
      editRowId: ''
    };

    this.delNotifyClose = this.delNotifyClose.bind(this);
    this.uploadSuccess = this.uploadSuccess.bind(this);
    this.cancelEditRow = this.cancelEditRow.bind(this);
    this.downloadAll = this.downloadAll.bind(this);
    this.previewImg = this.previewImg.bind(this);
    this.favorite = this.favorite.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    directory: PropTypes.string.isRequired,
    options: PropTypes.object,
    collection: PropTypes.array.isRequired,
    selectedItem: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired,
    addFile: PropTypes.func.isRequired,
    createFolderShow: PropTypes.bool.isRequired,
    cancelCreateFolder: PropTypes.func.isRequired,
    createFolder: PropTypes.func.isRequired,
    favorite: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    copy: PropTypes.func.isRequired,
    move: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired
  }

  cancelEditRow() {
    const { cancelCreateFolder } = this.props;
    cancelCreateFolder();
    this.setState({ editRowId: '' });
  }

  delNotifyClose() {
    this.setState({ delNotifyShow: false });
  }

  edit(id) {
    this.setState({ editModalShow: true });
    const { select } = this.props;
    select(id);
  }

  async favorite(id) {
    const { select } = this.props;
    if (id) {
      await select(id);
    }

    const { favorite, selectedItem } = this.props;
    const ecode = await favorite(selectedItem.id, !selectedItem.favorited);
    if (ecode === 0) {
      if (selectedItem.favorited) {
        notify.show('已收藏。', 'success', 2000);
      } else {
        notify.show('已取消收藏。', 'success', 2000);
      }
    } else {
      if (selectedItem.favorited) {
        notify.show('收藏失败。', 'error', 2000);
      } else {
        notify.show('取消失败。', 'error', 2000);
      }
    }
  }

  async operateSelect(eventKey) {
    const { hoverRowId } = this.state;
    const { select, project } = this.props;
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
      const url = urlWrapper('/project/' + project.key + '/document/' + hoverRowId + '/download');
      window.open(url, '_blank');
    } else if (eventKey === 'favorite') {
      this.favorite();
    }
  }

  downloadAll() {
    const { project, directory } = this.props;
    const url = urlWrapper('/project/' + project.key + '/document/' + directory + '/download');
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

  previewImg(imgFiles, id) {
    const photoIndex = _.findIndex(imgFiles, { id });
    this.setState({ photoIndex, imgPreviewShow: true });
  }

  render() {
    const { 
      i18n, 
      user,
      project,
      directory,
      collection, 
      selectedItem, 
      loading, 
      indexLoading, 
      itemLoading, 
      createFolderShow,
      createFolder, 
      del, 
      update, 
      copy, 
      move, 
      options, 
      query 
    } = this.props;

    const { 
      editRowId, 
      hoverRowId, 
      operateShow,
      photoIndex,
      imgPreviewShow
    } = this.state;

    const componentConfig = {
      showFiletypeIcon: true,
      postUrl: urlWrapper('/project/' + project.key + '/document/' + (directory ? (directory + '/') : '') + 'upload')
    };
    const djsConfig = {
      dictDefaultMessage: '点击或拖拽文件至此',
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
            <Link to={ '/project/' + project.key + '/document' + (parent.id !== '0' ? ( '/' + parent.id ) : '') }>返回上级</Link>
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
            <Link to={ '/project/' + project.key + '/document/' + v.id }>{ v.name }</Link>
            { v.favorited &&
            <span title='点击取消收藏' style={ { float: 'right', color: '#FFD300', cursor: 'pointer' } } onClick={ (e) => { this.favorite(v.id) } }><i className='fa fa-star'></i></span> }
          </div> ),
        operation: (
          <div>
          { operateShow 
            && project.status == 'active'
            && hoverRowId === v.id 
            && !itemLoading &&
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
              <MenuItem eventKey='favorite'>{ v.favorited ? '取消收藏' : '收藏' }</MenuItem>
              { options.permissions && options.permissions.indexOf('manage_project') !== -1 && <MenuItem eventKey='rename'>重命名</MenuItem> } 
              { options.permissions && options.permissions.indexOf('manage_project') !== -1 && <MenuItem eventKey='move'>移动</MenuItem> }
              { options.permissions && options.permissions.indexOf('manage_project') !== -1 && <MenuItem eventKey='del'>删除</MenuItem> }
            </DropdownButton> }
            <img src={ img } className={ (itemLoading && selectedItem.id === v.id) ? 'loading' : 'hide' }/>
          </div>)
      });      
    });

    const files = _.reject(collection, { d: 1 });
    const imgFiles = _.filter(files, (f) => _.indexOf([ 'image/jpeg', 'image/jpg', 'image/png', 'image/gif' ], f.type) !== -1);
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
            { _.findIndex(imgFiles, { id: files[i].id }) === -1 ?
              <a target='_blank' href={ urlWrapper('/project/' + project.key + '/document/' + files[i].id + '/download' + (files[i].type == 'application/pdf' ? ('/' + files[i].name) : '')) } download={ files[i].type == 'application/pdf' ? false : files[i].name } style={ { cursor: 'pointer' } }>
                { files[i].name }
              </a>
              :
              <a href='#' style={ { cursor: 'pointer' } } onClick={ (e) => { e.preventDefault(); this.previewImg(imgFiles, files[i].id); } }>
                { files[i].name }
              </a> }
            <span style={ { float: 'right' } }>
              { files[i].parent != directory && 
              <Link to={ '/project/' + project.key + '/document' + (files[i].parent == '0' ? '' : ('/' + files[i].parent) ) }><span style={ { marginRight: '10px', float: 'left' } }>打开目录</span></Link> }
              { files[i].favorited &&
              <span title='点击取消收藏' style={ { float: 'left', color: '#FFD300', cursor: 'pointer', marginRight: '10px' } } onClick={ (e) => { this.favorite(files[i].id) } }><i className='fa fa-star'></i></span> }
              { files[i].uploader &&
              <span style={ { marginRight: '10px', float: 'left' } }>
                { files[i].uploader.name + '  ' + moment.unix(files[i].uploaded_at).format('YYYY/MM/DD HH:mm') }
              </span> }
              <span style={ { float: 'left' } }>{ this.getFileSize(files[i].size) }</span>
            </span>
          </div> ),
        operation: (
          <div>
          { operateShow 
            && project.status == 'active'
            && hoverRowId === files[i].id 
            && !itemLoading &&
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
              <MenuItem eventKey='favorite'>{ files[i].favorited ? '取消收藏' : '收藏' }</MenuItem>
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
        <BackTop />
        <BootstrapTable data={ rows } bordered={ false } hover options={ opts } trClassName='tr-middle'>
          <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
          <TableHeaderColumn dataField='name'>名称</TableHeaderColumn>
          <TableHeaderColumn width='60' dataField='operation'/>
        </BootstrapTable>

        { imgPreviewShow &&
          <Lightbox
            mainSrc={ urlWrapper('/project/' + project.key + '/document/' + imgFiles[photoIndex].id + '/download') }
            nextSrc={ urlWrapper('/project/' + project.key + '/document/' + imgFiles[(photoIndex + 1) % imgFiles.length].id + '/download') }
            prevSrc={ urlWrapper('/project/' + project.key + '/document/' + imgFiles[(photoIndex + imgFiles.length - 1) % imgFiles.length].id + '/download') }
            imageTitle={ imgFiles[photoIndex].name }
            imageCaption={ imgFiles[photoIndex].uploader.name + ' 上传于 ' + moment.unix(imgFiles[photoIndex].uploaded_at).format('YYYY/MM/DD HH:mm') }
            onCloseRequest={ () => { this.setState({ imgPreviewShow: false }) } }
            onMovePrevRequest={ () => this.setState({ photoIndex: (photoIndex + imgFiles.length - 1) % imgFiles.length }) }
            onMoveNextRequest={ () => this.setState({ photoIndex: (photoIndex + 1) % imgFiles.length }) } /> }

        { project.status == 'active' &&
          <div style={ { marginTop: '15px' } }>
            <DropzoneComponent style={ { height: '200px' } } config={ componentConfig } eventHandlers={ eventHandlers } djsConfig={ djsConfig } />
          </div> }
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
          project_key={ project.key }
          close={ () => { this.setState({ copyModalShow: false }); } }
          copy={ copy }
          data={ selectedItem }
          i18n={ i18n }/> }
        { this.state.moveModalShow &&
        <MoveModal
          show
          project_key={ project.key }
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
    );
  }
}
