import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { FormGroup, FormControl, Button, DropdownButton, MenuItem } from 'react-bootstrap';
import DropzoneComponent from 'react-dropzone-component';
import Lightbox from 'react-image-lightbox';
import _ from 'lodash';
import { notify } from 'react-notify-toast';
import { getFileIconCss } from '../share/Funcs';

const $ = require('$');
const moment = require('moment');
const DelNotify = require('./DelNotify');
const CopyModal = require('./CopyModal');
const MoveModal = require('./MoveModal');
const EditCard = require('./EditCard');
const img = require('../../assets/images/loading.gif');

const { API_BASENAME } = process.env;

export default class Grids extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      copyModalShow: false,
      moveModalShow: false,
      delNotifyShow: false, 
      operateShow: false, 
      photoIndex: 0,
      imgPreviewShow: false, 
      currentId: '', 
      editRowId: ''
    };

    this.delNotifyClose = this.delNotifyClose.bind(this);
    this.uploadSuccess = this.uploadSuccess.bind(this);
    this.cancelEditCard = this.cancelEditCard.bind(this);
    this.downloadAll = this.downloadAll.bind(this);
    this.favorite = this.favorite.bind(this);
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

  cancelEditCard() {
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

  async favorite() {
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

  async clickFavorite(e) {
    e.stopPropagation();

    const { currentId } = this.state;
    const { select } = this.props;
    await select(currentId);
    this.favorite();
  }

  async operateSelect(eventKey, e) {
    e.stopPropagation();

    const { currentId } = this.state;
    const { select, project_key } = this.props;
    await select(currentId);

    if (eventKey === 'rename') {
      this.setState({ editRowId: currentId });
    } else if (eventKey === 'copy') {
      this.setState({ copyModalShow: true });
    } else if (eventKey === 'move') {
      this.setState({ moveModalShow: true });
    } else if (eventKey === 'del') {
      this.setState({ delNotifyShow: true });
    } else if (eventKey === 'download') {
      const url = API_BASENAME + '/project/' + project_key + '/document/' + currentId + '/download';
      window.open(url, '_blank');
    } else if (eventKey === 'favorite') {
      this.favorite();
    }
  }

  downloadAll() {
    const { project_key, directory } = this.props;
    const url = API_BASENAME + '/project/' + project_key + '/document/' + directory + '/download';
    window.open(url, '_blank');
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

  clickFile(imgFiles, id) {
    const { project_key, collection } = this.props;

    const photoIndex = _.findIndex(imgFiles, { id });
    if (photoIndex === -1) {
      const file = _.find(collection, { id });
      const url = API_BASENAME + '/project/' + project_key + '/document/' + id + '/download' + (file && file.type == 'application/pdf' ? ('/' + file.name) : '');
      window.open(url, '_blank');
    } else {
      this.setState({ photoIndex, imgPreviewShow: true });
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
      currentId, 
      operateShow, 
      photoIndex,
      imgPreviewShow
    } = this.state;

    const componentConfig = {
      showFiletypeIcon: true,
      postUrl: API_BASENAME + '/project/' + project_key + '/document/' + (directory ? (directory + '/') : '') + 'upload'
    };
    const djsConfig = {
      addRemoveLinks: true
    };
    const eventHandlers = {
      init: dz => this.dropzone = dz,
      success: (localfile, response) => { this.uploadSuccess(localfile, response); this.dropzone.removeFile(localfile); }, 
      error: (localfile) => { notify.show('文档上传失败。', 'error', 2000); this.dropzone.removeFile(localfile); }
    }

    const directories = _.filter(collection, { d: 1 });
    const files = _.reject(collection, { d: 1 });
    const imgFiles = _.filter(files, (f) => _.indexOf([ 'image/jpeg', 'image/jpg', 'image/png', 'image/gif' ], f.type) !== -1);

    return (
      <div style={ { clear: 'both' } }>
        <div className='files-grid-view'>
          { indexLoading && 
            <div style={ { display: 'block', padding: '30px 0px', textAlign: 'center' } }>
              <img src={ img } className='loading'/>
            </div> }
          <div className='grid-view-container'>
            { !indexLoading && options.path && options.path.length > 1 && _.isEmpty(query) && 
            <div className='grid-view-item'>
              <div className='file-content'>
                <Link to={ '/project/' + project_key + '/document' + (options.path[options.path.length - 2].id !== '0' ? ('/' + options.path[options.path.length - 2].id ) : '') } style={ { textDecoration: 'none' } }>
                  <div className='file-thumb'>
                    <div style={ { fontSize: '80px', color: '#FFD300', marginBottom: '30px' } }>..</div> 
                  </div>
                  <div className='file-title-container'>
                    <div className='file-title'>返回上级</div>
                  </div>
                </Link>
              </div>
            </div> }

            { createFolderShow &&
              <EditCard
                i18n={ i18n }
                loading={ itemLoading }
                data={ {} }
                createFolder={ createFolder }
                collection={ collection }
                cancel={ this.cancelEditCard }
                mode='createFolder'/> }

            { _.map(directories, (v) => this.state.editRowId == v.id ?
              <EditCard
                i18n={ i18n }
                loading={ itemLoading }
                data={ selectedItem }
                collection={ collection }
                edit={ update }
                cancel={ this.cancelEditCard }
                mode='editFolder' />
              :
              <div className='grid-view-item' title={ v.name } onMouseOver={ () => { this.setState({ currentId: v.id }) } } onMouseLeave={ () => { this.setState({ currentId: '' }) } }>
                <div className='file-content'>
                  { this.state.currentId == v.id &&
                  <div className='operate-icon'>
                    <DropdownButton
                      bsStyle='link'
                      style={ { textDecoration: 'blink', color: '#999' } }
                      key={ v.id }
                      title=<i className='fa fa-cog'></i>
                      onClick={ this.cancelEditCard }
                      onSelect={ this.operateSelect.bind(this) } >
                      <MenuItem eventKey='download'>下载</MenuItem>
                      <MenuItem eventKey='favorite'>{ v.favorited ? '取消收藏' : '收藏' }</MenuItem>
                      { options.permissions && options.permissions.indexOf('manage_project') !== -1 && <MenuItem eventKey='rename'>重命名</MenuItem> }
                      { options.permissions && options.permissions.indexOf('manage_project') !== -1 && <MenuItem eventKey='move'>移动</MenuItem> }
                      { options.permissions && options.permissions.indexOf('manage_project') !== -1 && <MenuItem eventKey='del'>删除</MenuItem> }
                    </DropdownButton>
                  </div> }
                  { v.favorited &&
                  <div className='favorite-icon'>
                    <span onClick={ this.clickFavorite.bind(this) }><i className='fa fa-star'></i></span>
                  </div> }
                  <Link to={ '/project/' + project_key + '/document/' + v.id }>
                    <div className='file-thumb'>
                      <span style={ { fontSize: '80px', color: '#FFD300' } }><i className='fa fa-folder'></i></span>
                    </div>
                    <div className='file-title-container'>
                      <div className='file-title'>{ v.name }</div>
                    </div>
                  </Link>
                </div>
              </div>) }
            { _.map(files, (v) => this.state.editRowId == v.id ?
              <EditCard
                i18n={ i18n }
                loading={ itemLoading }
                data={ selectedItem }
                collection={ collection }
                edit={ update }
                cancel={ this.cancelEditCard }
                mode='editFile'
                imgsrc={ v.thumbnails_index ? API_BASENAME + '/project/' + project_key + '/document/' + v.id + '/downloadthumbnails' : '' }
                fileIconCss={ getFileIconCss(v.name) }/>
              :
              <div className='grid-view-item' title={ v.name } onMouseOver={ () => { this.setState({ currentId: v.id }) } } onMouseLeave={ () => { this.setState({ currentId: '' }) } }>
                <div className='file-content' onClick={ this.clickFile.bind(this, imgFiles, v.id) }>
                  { this.state.currentId == v.id &&
                  <div className='operate-icon'>
                    <DropdownButton
                      bsStyle='link'
                      style={ { textDecoration: 'blink', color: '#999' } }
                      key={ v.id }
                      title=<i className='fa fa-cog'></i> 
                      onClick={ (e) => { e.stopPropagation(); this.cancelEditCard(); } }
                      onSelect={ this.operateSelect.bind(this) } >
                      <MenuItem eventKey='download'>下载</MenuItem>
                      <MenuItem eventKey='favorite'>{ v.favorited ? '取消收藏' : '收藏' }</MenuItem>
                      { options.permissions && (options.permissions.indexOf('manage_project') !== -1 || v.uploader.id == user.id) && <MenuItem eventKey='rename'>重命名</MenuItem> }
                      { options.permissions && (options.permissions.indexOf('manage_project') !== -1 || v.uploader.id == user.id) && <MenuItem eventKey='move'>移动</MenuItem> }
                      { options.permissions && (options.permissions.indexOf('manage_project') !== -1 || v.uploader.id == user.id) && <MenuItem eventKey='del'>删除</MenuItem> }
                    </DropdownButton>
                  </div> }
                  { v.favorited &&
                  <div className='favorite-icon'>
                    <span onClick={ this.clickFavorite.bind(this) }><i className='fa fa-star'></i></span>
                  </div> }
                  <div className='file-thumb'>
                    { v.thumbnails_index ?
                      <img src={ API_BASENAME + '/project/' + project_key + '/document/' + v.id + '/downloadthumbnails' }/>
                      :
                      <span style={ { fontSize: '80px', color: '#aaa' } }>
                        <i className={ getFileIconCss(v.name) }></i>
                      </span> }
                    </div>
                  <div className='file-title-container'>
                    <div className='file-title'>{ v.name }</div>
                  </div>
                </div>
              </div>) }
          </div>
        </div>

        { imgPreviewShow &&
          <Lightbox
            mainSrc={ API_BASENAME + '/project/' + project_key + '/document/' + imgFiles[photoIndex].id + '/download' }
            nextSrc={  API_BASENAME + '/project/' + project_key + '/document/' + imgFiles[(photoIndex + 1) % imgFiles.length].id + '/download' }
            prevSrc={  API_BASENAME + '/project/' + project_key + '/document/' + imgFiles[(photoIndex + imgFiles.length - 1) % imgFiles.length].id + '/download' }
            imageTitle={ imgFiles[photoIndex].name }
            imageCaption={ imgFiles[photoIndex].uploader.name + ' 上传于 ' + moment.unix(imgFiles[photoIndex].uploaded_at).format('YYYY/MM/DD HH:mm') }
            onCloseRequest={ () => { this.setState({ imgPreviewShow: false }) } }
            onMovePrevRequest={ () => this.setState({ photoIndex: (photoIndex + imgFiles.length - 1) % imgFiles.length }) }
            onMoveNextRequest={ () => this.setState({ photoIndex: (photoIndex + 1) % imgFiles.length }) } /> }

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
    );
  }
}
