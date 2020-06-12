import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { FormGroup, FormControl, Button, DropdownButton, MenuItem } from 'react-bootstrap';
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

const { API_BASENAME } = process.env;

export default class Grids extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      copyModalShow: false,
      moveModalShow: false,
      delNotifyShow: false, 
      operateShow: false, 
      hoverRowId: '', 
      editRowId: ''
    };

    this.delNotifyClose = this.delNotifyClose.bind(this);
    this.uploadSuccess = this.uploadSuccess.bind(this);
    this.cancelEditRow = this.cancelEditRow.bind(this);
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
    select: PropTypes.func.isRequired,
    addFile: PropTypes.func.isRequired,
    createFolderShow: PropTypes.bool.isRequired,
    cancelCreateFolder: PropTypes.func.isRequired,
    createFolder: PropTypes.func.isRequired,
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
      const url = API_BASENAME + '/project/' + project_key + '/document/' + hoverRowId + '/download';
      window.open(url, '_blank');
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
      hoverRowId, 
      operateShow 
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

    return (
      <div>
        <div className='files-grid-view'>
          <div className='grid-view-container'>
            { !indexLoading && options.path && options.path.length > 1 && _.isEmpty(query) && 
            <div className='grid-view-item'>
              <div className='attachment-content'>
                <Link to={ '/project/' + project_key + '/document/' + (options.path[options.path.length - 2].id !== '0' ? ('/' + options.path[options.path.length - 2].id ) : '') }>
                  <div className='attachment-thumb'>
                    <span style={ { fontSize: '90px', color: '#FFD300' } }>...</span> 
                  </div>
                </Link>
                <div className='attachment-title-container'>
                  <div className='attachment-title'>返回上级</div>
                </div>
              </div>
            </div> }
            { _.map(directories, (v) => 
            <div className='grid-view-item'>
              <div className='attachment-content'>
                <Link to={ '/project/' + project_key + '/document/' + v.id }>
                  <div className='attachment-thumb'>
                    <span style={ { fontSize: '90px', color: '#FFD300' } }><i className='fa fa-folder'></i></span>
                  </div>
                </Link>
                <div className='attachment-title-container'>
                  <div className='attachment-title'>{ v.name }</div>
                </div>
              </div>
            </div>) }
            { _.map(files, (v) => 
            <div className='grid-view-item'>
              <div className='attachment-content'>
                <a href={ API_BASENAME + '/project/' + project_key + '/document/' + v.id + '/download' } download={ v.name }>
                  <div className='attachment-thumb'>
                  { v.thumbnails_index ?
                    <img src={ API_BASENAME + '/project/' + project_key + '/file/' + v.thumbnails_index }/>
                    :
                    <span style={ { fontSize: '90px', color: '#aaa' } }>
                      <i className={ getFileIconCss(v.name) }></i>
                    </span> }
                  </div>
                </a>
                <div className='attachment-title-container'>
                  <div className='attachment-title'>{ v.name }</div>
                </div>
              </div>
            </div>) }
          </div>
        </div>
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
