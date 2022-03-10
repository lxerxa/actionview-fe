import React, { PropTypes, Component } from 'react';
import { createHistory } from 'history';
import { Link } from 'react-router';
import { Button, Label, DropdownButton, MenuItem, Breadcrumb, Table } from 'react-bootstrap';
import DropzoneComponent from 'react-dropzone-component';
import _ from 'lodash';
import Lightbox from 'react-image-lightbox';
import { notify } from 'react-notify-toast';
import { getFileIconCss } from '../share/Funcs';

const history = createHistory();
const moment = require('moment');
const loadingImg = require('../../assets/images/loading.gif');
const marked = require('marked');

const DelNotify = require('./DelNotify');
const CheckoutNotify = require('./CheckoutNotify');
const DelFileModal = require('./DelFileModal');
const EditModal = require('./EditModal');
const VersionView = require('./VersionView');

const { API_BASENAME } = process.env;

export default class Preview extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      operate: '', 
      version: '', 
      inlinePreviewShow: false,
      photoIndex: 0, 
      delNotifyShow: false, 
      checkoutNotifyShow: false, 
      editModalShow: false, 
      versionViewShow: false, 
      selectedFile: {},
      delFileShow: false 
    };
    this.refresh = this.refresh.bind(this);
    this.checkin = this.checkin.bind(this);
    this.checkout = this.checkout.bind(this);
    this.uploadSuccess = this.uploadSuccess.bind(this);
    this.downloadAll = this.downloadAll.bind(this);
    this.delFileModalClose = this.delFileModalClose.bind(this);
    this.previewInlineImg = this.previewInlineImg.bind(this);
    this.createLightbox = this.createLightbox.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    wid: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    itemDetailLoading: PropTypes.bool.isRequired,
    item: PropTypes.object.isRequired,
    goto: PropTypes.func.isRequired,
    show: PropTypes.func.isRequired,
    checkin: PropTypes.func.isRequired,
    checkout: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    delFile: PropTypes.func.isRequired,
    addAttachment: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired,
    directoryShow: PropTypes.bool.isRequired,
    toggleDirectory: PropTypes.func.isRequired,
    favorite: PropTypes.func.isRequired
  }

  async componentWillMount() {
    const { show, wid } = this.props;
    const ecode = await show(wid);
    if (ecode !== 0) {
      notify.show('文档信息获取失败。', 'error', 2000);
    }
  }

  async componentWillReceiveProps(nextProps) {
    const { show, wid } = this.props;
    if (nextProps.wid !== wid) {
      const ecode = await show(nextProps.wid);
      if (ecode !== 0) {
        notify.show('文档信息获取失败。', 'error', 2000);
      }
    }
  }

  async refresh() {
    this.state.operate = 'refresh';
    const { show, wid } = this.props;
    const ecode = await show(wid);
    if (ecode !== 0) {
      notify.show('文档信息获取失败。', 'error', 2000);
    } else {
      notify.show('已完成。', 'success', 2000);
    }
  }

  async checkout() {
    this.state.operate = 'checkout';

    const { checkout, item, user } = this.props;
    if (item.checkin && item.checkin.user.id !== user.id) {
      this.setState({ checkoutNotifyShow: true });
    } else {
      const ecode = await checkout(item.id);
      if (ecode !== 0) {
        notify.show('文档解锁失败。', 'error', 2000);
      } else {
        notify.show('已解锁。', 'success', 2000);
      }
    }
  }

  async checkin() {
    this.state.operate = 'checkin';
    const { checkin, wid } = this.props;
    const ecode = await checkin(wid);
    if (ecode !== 0) {
      notify.show('文档加锁失败。', 'error', 2000);
    } else {
      notify.show('已加锁。', 'success', 2000);
    }
  }

  async selectVersion(v) {
    this.state.version = v;
    const { show, wid } = this.props;
    const ecode = await show(wid, v);
    if (ecode !== 0) {
      notify.show('文档信息获取失败。', 'error', 2000);
    } else {
      notify.show('已完成。', 'success', 2000);
    }
  }

  delNotifyClose() {
    this.setState({ delNotifyShow: false });
  }

  checkoutNotifyClose() {
    this.setState({ checkoutNotifyShow: false });
  }

  editModalClose() {
    this.setState({ editModalShow: false });
  }

  versionViewClose() {
    this.setState({ versionViewShow: false });
  }

  delFileNotify(id, name) {
    this.setState({ delFileShow: true, selectedFile: { id, name } });
  }

  delFileModalClose() {
    this.setState({ delFileShow: false });
  }

  uploadSuccess(localfile, res) {
    const { addAttachment } = this.props;
    if (res.ecode === 0 && res.data) {
      addAttachment(res.data);
    } else {
      notify.show('文档上传失败。', 'error', 2000);
    }
  }

  downloadAll() {
    const { project, wid } = this.props;
    const url = API_BASENAME + '/project/' + project.key + '/wiki/' + wid + '/download';
    window.open(url, '_blank');
  }

  edit() {
    const { wid, goto } = this.props;
    goto('edit', wid);
  }

  async favorite() {
    const { favorite, item } = this.props;
    const ecode = await favorite(item.id, !item.favorited);
    if (ecode === 0) {
      if (item.favorited) {
        notify.show('已收藏。', 'success', 2000);
      } else {
        notify.show('已取消收藏。', 'success', 2000);
      }
    } else {
      if (item.favorited) {
        notify.show('收藏失败。', 'error', 2000);
      } else {
        notify.show('取消失败。', 'error', 2000);
      }
    }
  }

  extractImg(txt) {
    let html = txt;
    const images = html.match(/<img(.*?)>/ig);
    const imgFileUrls = [];
    if (images) {
      _.forEach(images, (v, i) => {
        const pattern = new RegExp('^<img src="(.*?)"(.*?)>$');
        if (pattern.exec(v)) {
          const imgurl = RegExp.$1;
          if (!imgurl) {
            return;
          }
          html = html.replace(v, '<img class="inline-img" id="inlineimg-' + i + '" src="' + imgurl + '"/>');
          imgFileUrls.push(imgurl);
        }
      });
    }
    return { html, imgFileUrls };
  }

  createLightbox(imgFiles, photoIndex) {
    return (
      <Lightbox
        mainSrc={ imgFiles[photoIndex] }
        nextSrc={ imgFiles[(photoIndex + 1) % imgFiles.length] }
        prevSrc={ imgFiles[(photoIndex + imgFiles.length - 1) % imgFiles.length] }
        imageTitle=''
        imageCaption=''
        onCloseRequest={ () => { this.setState({ inlinePreviewShow: false }) } }
        onMovePrevRequest={ () => this.setState({ photoIndex: (photoIndex + imgFiles.length - 1) % imgFiles.length }) }
        onMoveNextRequest={ () => this.setState({ photoIndex: (photoIndex + 1) % imgFiles.length }) } /> );
  }

  previewInlineImg(e) {
    const targetid = e.target.id;
    if (!targetid) {
      return;
    }

    let imgInd = -1;
    if (targetid.indexOf('inlineimg-') === 0) {
      imgInd = targetid.substr(targetid.lastIndexOf('-') + 1) - 0;
    } else {
      return;
    }

    this.setState({ inlinePreviewShow: true, photoIndex: imgInd });
  }

  render() {
    const { 
      i18n, 
      options, 
      user, 
      project, 
      loading, 
      itemDetailLoading, 
      itemLoading, 
      item, 
      wid,
      update, 
      del, 
      delFile,
      checkin,
      checkout,
      show, 
      reload,
      directoryShow,
      toggleDirectory
    } = this.props;

    if (!itemDetailLoading && _.isEmpty(item)) {
      return (<div/>);
    }

    const componentConfig = {
      showFiletypeIcon: true,
      postUrl: API_BASENAME + '/project/' + project.key + '/wiki/' + item.id + '/upload'
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

    marked.setOptions({ breaks: true });
    const { html, imgFileUrls } = this.extractImg(marked(item.contents || ''));

    let isNewestVer = true;
    if (item.versions && item.version < item.versions.length) {
      isNewestVer = false;
    }

    let isCheckin = false;
    if (item.checkin && !_.isEmpty(item.checkin)) {
      isCheckin = true;
    }

    return (
      <div>
        { itemDetailLoading &&
        <div>
          <div style={ { margin: '0 auto', width: '100px', paddingTop: '25px' } }>
            <img src={ loadingImg } className='loading'/>
          </div>
        </div> }
        { item.id &&
        <div>
          <span style={ { float: 'left' } } className='directory-indent' onClick={ () => { toggleDirectory(); } }><i className={ directoryShow ? 'fa fa-outdent' : 'fa fa-indent' }></i></span>
          <span style={ { float: 'left' } }>
            <Breadcrumb style={ { marginBottom: '0px', backgroundColor: '#fff', paddingLeft: '5px', marginTop: '0px' } }>
            { _.map(options.path || [], (v, i) => {
              if (i === 0) {
                return (<Breadcrumb.Item key={ i } disabled={ itemLoading }><Link to={ '/project/' + project.key + '/wiki' }>根目录</Link></Breadcrumb.Item>);
              } else {
                return (<Breadcrumb.Item key={ i } disabled={ itemLoading }><Link to={ '/project/' + project.key + '/wiki/' + v.id }>{ v.name }</Link></Breadcrumb.Item>);
              }
            }) }
            </Breadcrumb>
          </span>
          { !_.isEmpty(item.attachments) &&
          <a href='#attachmentlist'>
            <span style={ { paddingTop: '8px', float: 'left' } } title={ item.attachments.length + '个附件' }>
              <i className='fa fa-paperclip fa-rotate-90'></i>
            </span>
          </a> }
          { (!isCheckin || (isCheckin && item.checkin.user.id === user.id)) && !(this.state.operate === 'delete' && itemLoading) && project.status == 'active' &&
          <span style={ { float: 'right' } }>
            <Button style={ { marginRight: '5px' } } disabled={ itemLoading } onClick={ this.edit.bind(this) }><i className='fa fa-edit'></i> 编辑</Button>
            <Button bsStyle='link' style={ { fontSize: '14px', marginRight: '5px' } } disabled={ itemLoading } onClick={ () => { this.setState({ operate: 'delete', delNotifyShow: true }); } }>删除</Button>
          </span> }
          { this.state.operate === 'delete' && itemLoading &&
          <span style={ { float: 'right', marginRight: '10px' } }>
           <img src={ loadingImg } className='loading'/>
          </span> }
          <span style={ { float: 'right', marginRight: '5px' } }>
            <Link to={ '/project/' + project.key + '/wiki' + (item.parent != '0' ? ('/' + item.parent) : '') }>
              <Button style={ { marginRight: '5px' } }><i className='fa fa-reply'></i> 返回目录</Button>
            </Link>
          </span>
        </div> }
        { item.id &&
        <div style={ { paddingLeft: '5px', lineHeight: 2, clear: 'both' } }>
          <span style={ { fontSize: '25px', fontWeight: 400, whiteSpace: 'pre-wrap', wordWrap: 'break-word' } }>{ item.name || '' }</span>
        </div> }
        { item.id &&
        <div style={ { lineHeight: 2, borderBottom: '1px solid #e6ebf1', paddingLeft: '5px', paddingBottom: '10px', fontSize: '12px' } }>
          <span>创建者：{ item.creator && item.creator.name || '' }，</span>
          { isNewestVer ? 
          <span style={ { color: '#707070' } }>该版本为最新版，{ item.editor && item.editor.name ? item.editor.name : (item.creator && item.creator.name || '') }于 { item.updated_at ? moment.unix(item.updated_at).format('YYYY/MM/DD HH:mm') : moment.unix(item.created_at).format('YYYY/MM/DD HH:mm') } 编辑。</span>
          :
          <span style={ { color: '#707070' } }>当前版本 - { item.version }，{ item.editor && item.editor.name || '' }于 { item.updated_at ? moment.unix(item.updated_at).format('YYYY/MM/DD HH:mm') : '' } 编辑。</span> }

          { item.versions && item.versions.length > 1 &&
          <span style={ { color: '#707070' } }>共 <a href='#' onClick={ (e) => { e.preventDefault(); this.setState({ versionViewShow: true }); } }>{ item.versions.length }</a> 个版本。</span> }

          { item.checkin && !_.isEmpty(item.checkin) && 
          <span style={ { marginLeft: '8px', color: '#f0ad4e' } }><i className='fa fa-lock'></i> 该文档被{ item.checkin.user ? (item.checkin.user.id == user.id ? '我' : (item.checkin.user.name || '')) : '' }于 { item.checkin.at ? moment.unix(item.checkin.at).format('YYYY/MM/DD HH:mm') : '' } 锁定。</span> }

          { itemLoading && (this.state.operate == 'checkin' || this.state.operate == 'checkout') ? 
          <span>
            <img src={ loadingImg } className='loading' style={ { width: '13px', height: '13px' } }/>
          </span>
          :
          <span>
            { !_.isEmpty(item.checkin) && ((item.checkin.user && item.checkin.user.id === user.id) || (options.permissions && options.permissions.indexOf('manage_project') !== -1)) &&
            <span style={ { marginLeft: '8px' } }><a href='#' title='解锁' onClick={ (e) => { e.preventDefault(); this.checkout(); } }><i className='fa fa-unlock'></i></a></span> } 
            { _.isEmpty(item.checkin) && 
            <span style={ { marginLeft: '8px' } }><a href='#' title='锁定' onClick={ (e) => { e.preventDefault(); this.checkin(); } }><i className='fa fa-lock'></i></a></span> }

            <span style={ { marginLeft: '8px' } }><a href='#' onClick={ (e) => { e.preventDefault(); this.refresh(); } } title={ isNewestVer ? '刷新' : '最新版' }><i className='fa fa-refresh'></i></a></span>
          </span> }
          { item.favorited ?
            <span style={ { marginLeft: '10px', cursor: 'pointer', color: '#FFD300' } } title='点击取消收藏' onClick={ this.favorite.bind(this) }><i className='fa fa-star'></i></span>
            :
            <span style={ { marginLeft: '10px', cursor: 'pointer' } } title='点击收藏' onClick={ this.favorite.bind(this) }><i className='fa fa-star-o'></i></span> }
        </div> }
        <div style={ { marginTop: '15px', marginBottom: '20px', paddingLeft: '5px' } }>
          { item.id && html && 
            <div id='wiki-contents' className='markdown-body' onClick={ this.previewInlineImg } dangerouslySetInnerHTML= { { __html: html } }/> }
          { this.state.inlinePreviewShow && this.createLightbox(imgFileUrls, this.state.photoIndex) }
          { item.id && !html && 
            <div style={ { height: '200px', textAlign: 'center' } }>
              <div style={ { paddingTop: '80px', color: '#999' } }>暂无内容</div> 
            </div> }
        </div>
        { item.id && item.attachments && item.attachments.length > 0 &&
        <div style={ { marginBottom: '5px' } }>
          <div style={ { marginLeft: '2px', marginBottom: '5px', fontWeight: 600 } }>附件：</div>
          <Table id='attachmentlist' condensed hover responsive style={ { borderBottom: '1px solid #ddd' } }>
            <tbody>
            { _.map(item.attachments, (f, i) =>
              <tr key={ i }>
                <td>
                  <span style={ { marginRight: '5px', color: '#777' } }><i className={ getFileIconCss(f.name) }></i></span>
                  <a href={ API_BASENAME + '/project/' + project.key + '/wiki/' + wid +'/file/' + f.id + '/download' } download={ f.name }>{ f.name }</a>
                 </td>
                 <td width='10%'>
                   <div style={ { whiteSpace: 'nowrap' } }>{ f.uploader.name + '  ' + moment.unix(f.uploaded_at).format('YYYY/MM/DD HH:mm') }</div>
                 </td>
                 { ((options.permissions && options.permissions.indexOf('manage_project') !== -1) || user.id === f.uploader.id) &&
                 <td width='2%'>
                   <span className='remove-icon' onClick={ this.delFileNotify.bind(this, f.id, f.name) }>
                     <i className='fa fa-trash'></i>
                   </span>
                 </td> }
              </tr>) }
            </tbody>
          </Table>
        </div> }
        { item.id && project.status == 'active' &&
        <div style={ { marginTop: '0px' } }>
          <DropzoneComponent style={ { height: '200px' } } config={ componentConfig } eventHandlers={ eventHandlers } djsConfig={ djsConfig } />
        </div> }
        { item.attachments && item.attachments.length > 1 &&
        <div style={ { marginLeft: '5px', marginTop: '10px' } }>
          <i className='fa fa-download'></i>
          <a href='#' onClick={ (e) => { e.preventDefault(); this.downloadAll(); } }>下载全部</a>
        </div> }
        <div style={ { marginBottom: '40px' } }/>
        { this.state.delNotifyShow &&
        <DelNotify
          show
          close={ this.delNotifyClose.bind(this) }
          data={ item }
          reload = { reload }
          del={ del }/> }
        { this.state.checkoutNotifyShow &&
          <CheckoutNotify
            show
            close={ this.checkoutNotifyClose.bind(this) }
            data={ item }
            checkout={ checkout }/> }
        { this.state.versionViewShow &&
        <VersionView
          show
          close={ this.versionViewClose.bind(this) }
          select={ this.selectVersion.bind(this) }
          versions={ item.versions || [] }/> }
        { this.state.editModalShow &&
        <EditModal
          i18n={ i18n }
          show
          user={ user }
          checkin={ checkin }
          get={ show }
          close={ this.editModalClose.bind(this) }
          path={ options.path || [] }
          itemLoading={ itemLoading }
          loading={ loading }
          wid={ wid }
          data={ item }
          update={ update }/> }
        { this.state.delFileShow &&
        <DelFileModal
          show
          close={ this.delFileModalClose }
          del={ delFile }
          data={ this.state.selectedFile }
          loading={ loading }
          wid={ wid }
          i18n={ i18n }/> }
      </div>
    );
  }
}
