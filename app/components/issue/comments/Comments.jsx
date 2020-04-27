import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Form, FormControl, FormGroup, Col, Panel, Checkbox } from 'react-bootstrap';
import Lightbox from 'react-image-lightbox';
import _ from 'lodash';
import { notify } from 'react-notify-toast';
import { getAgoAt } from '../../share/Funcs';

const $ = require('$');
const img = require('../../../assets/images/loading.gif');
const moment = require('moment');
const DelCommentsModal = require('./DelCommentsModal');
const DelReplyModal = require('./DelReplyModal');
const EditCommentsModal = require('./EditCommentsModal');

export default class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      ecode: 0, 
      photoIndex: 0,
      inlinePreviewShow: {},
      addCommentsShow: false, 
      editCommentsShow: false, 
      delCommentsShow: false, 
      delReplyShow: false, 
      selectedComments: {}, 
      contents:  '',  
      atWho: [] 
    };
    this.state.displayTimeFormat = window.localStorage && window.localStorage.getItem('comments-displayTimeFormat') || 'relative';

    this.addAtWho = this.addAtWho.bind(this);
    this.addComments = this.addComments.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    currentTime: PropTypes.number.isRequired,
    currentUser: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    permissions: PropTypes.array.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    indexComments: PropTypes.func.isRequired,
    sortComments: PropTypes.func.isRequired,
    addComments: PropTypes.func.isRequired,
    editComments: PropTypes.func.isRequired,
    delComments: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
    collection: PropTypes.array.isRequired,
    issue_id: PropTypes.string
  }

  async showCommentsInputor() {
    await this.setState({ addCommentsShow: true });
    $('.comments-inputor textarea').focus();
  }

  showDelComments(data) {
    this.setState({ delCommentsShow: true, selectedComments: data });
  }

  showEditComments(data) {
    this.setState({ editCommentsShow: true, selectedComments: data });
  }

  showDelReply(parent_id, data) {
    this.setState({ delReplyShow: true, selectedComments: _.extend(data, { parent_id }) });
  }

  showEditReply(parent_id, data) {
    this.setState({ editCommentsShow: true, selectedComments: _.extend(data, { parent_id }) });
  }

  showAddReply(parent_id, to) {
    this.setState({ editCommentsShow: true, selectedComments: { parent_id, to } });
  }

  async addComments() {
    const { addComments, users, issue_id } = this.props;
    const newAtWho = [];
    _.map(_.uniq(this.state.atWho), (val) => {
      const user = _.find(users, { id: val });
      if (user && this.state.contents.indexOf('@' + user.name) !== -1) {
        newAtWho.push(val);
      }
    });
    const ecode = await addComments(issue_id, { contents: this.state.contents, atWho: _.map(newAtWho, (v) => _.find(users, { id: v }) ) }); 
    if (ecode === 0) {
      this.setState({ addCommentsShow: false, contents: '', atWho: [] });
      notify.show('已添加备注。', 'success', 2000);
    } else {
      notify.show('备注添加失败。', 'error', 2000);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.indexLoading) {
      this.setState({ addCommentsShow: false, contents: '', atWho: [] });
    }
  }

  addAtWho(user) {
    this.state.atWho.push(user.id);
  }

  componentDidMount() {
    const { project, permissions=[] } = this.props;
    if (permissions.indexOf('upload_file') !== -1) {
      const self = this;
      $(function() {
        $('.comments-inputor textarea').inlineattachment({
          allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'],
          uploadUrl: '/api/project/' + project.key + '/file',
          onFileUploaded: (editor, filename) => {
            self.setState({ contents: editor.getValue() });
          },
          onFileReceived: (editor, file) => {
            self.setState({ contents: editor.getValue() });
          }
        });
      });
    }
  }

  previewInlineImg(e) {
    const { permissions } = this.props;

    if (permissions.indexOf('download_file') === -1) {
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
    }

    this.state.inlinePreviewShow[fieldkey] = true;
    this.setState({ inlinePreviewShow: this.state.inlinePreviewShow, photoIndex: imgInd });
  }

  componentDidUpdate() {
    const { users } = this.props;
    _.map(users || [], (v) => {
      v.nameAndEmail = v.name + '(' + v.email + ')';
      return v;
    });
    const self = this;
    $('.comments-inputor textarea').atwho({
      at: '@',
      searchKey: 'nameAndEmail',
      displayTpl: '<li>${nameAndEmail}</li>',
      insertTpl: '${nameAndEmail}',
      callbacks: {
        beforeInsert: function(value, $li) {
          const user = _.find(users, { nameAndEmail: value });
          if (user) {
            self.state.atWho.push(user.id);
          }
          return '@' + user.name;
        }
      },
      data: users
    });
    $('.comments-inputor textarea').one('inserted.atwho', function(event, flag, query) {
      self.setState({ contents: event.target.value });
    });
  }

  swapTime() {
    if (this.state.displayTimeFormat == 'relative') {
      if (window.localStorage) {
        window.localStorage.setItem('comments-displayTimeFormat', 'absolute');
      }
      this.setState({ displayTimeFormat: 'absolute' });
    } else {
      if (window.localStorage) {
        window.localStorage.setItem('comments-displayTimeFormat', 'relative');
      }
      this.setState({ displayTimeFormat: 'relative' });
    }
  }

  render() {
    const { 
      i18n, 
      currentTime,
      permissions, 
      currentUser, 
      indexComments, 
      sortComments, 
      collection, 
      indexLoading, 
      loading, 
      itemLoading, 
      delComments, 
      editComments, 
      users, 
      project, 
      issue_id } = this.props;

    const { inlinePreviewShow, photoIndex } = this.state;

    return (
      <Form horizontal style={ { padding: '0px 5px' } }>
        <FormGroup>
          <Col sm={ 12 } className={ indexLoading && 'hide' } style={ { marginTop: '15px', marginBottom: '10px' } }>
            <div>
              <span className='comments-button' title='刷新' style={ { marginRight: '10px', float: 'right' } } onClick={ () => { indexComments(issue_id) } }><i className='fa fa-refresh'></i> 刷新</span>
              <span className='comments-button' title='排序' style={ { marginRight: '10px', float: 'right' } } onClick={ () => { sortComments() } }><i className='fa fa-sort'></i> 排序</span>
              { permissions.indexOf('add_comments') !== -1 && 
              <span className='comments-button' title='添加' style={ { marginRight: '10px', float: 'right' } } onClick={ this.showCommentsInputor.bind(this) }><i className='fa fa-comment-o'></i> 添加</span> }
              <span style={ { marginRight: '20px', float: 'right' } }>
                <Checkbox 
                  style={ { paddingTop: '0px', minHeight: '18px' } }
                  checked={ this.state.displayTimeFormat == 'absolute' ? true : false } 
                  onClick={ this.swapTime.bind(this) }>
                  显示绝对时间 
                </Checkbox>
              </span>
            </div>
          </Col>
          <Col sm={ 12 } className={ this.state.addCommentsShow || 'hide' }>
            <div className='comments-inputor'>
              <FormControl
                componentClass='textarea'
                disabled={ loading }
                style={ { height: '150px' } }
                onChange={ (e) => { this.setState({ contents: e.target.value }) } }
                value={ this.state.contents } 
                onKeyDown={ (e) => { if (e.keyCode == '13' && e.ctrlKey && !_.isEmpty(_.trim(this.state.contents))) { this.addComments(); } } }
                placeholder='支持@项目成员，Ctrl+Enter发布备注。' />
            </div>
            <div style={ { textAlign: 'right', marginBottom: '10px' } }>
              <img src={ img } className={ loading ? 'loading' : 'hide' } />
              <Button style={ { marginLeft: '10px' } } onClick={ this.addComments } disabled={ loading || _.isEmpty(_.trim(this.state.contents)) }>添加</Button>
              <Button bsStyle='link' style={ { marginRight: '5px' } } onClick={ () => { this.setState({ addCommentsShow: false }) } } disabled={ loading }>取消</Button>
            </div>
          </Col>
          <Col sm={ 12 }>
          { indexLoading && <div style={ { width: '100%', textAlign: 'center', marginTop: '15px' } }><img src={ img } className='loading' /></div> }
          { collection.length <= 0 && !indexLoading ?
            <div style={ { width: '100%', textAlign: 'left', marginTop: '10px', marginLeft: '10px' } }>暂无备注。</div>
            :
            _.map(collection, (val, i) => {
              const header = ( <div style={ { fontSize: '12px' } }>
                <span dangerouslySetInnerHTML= { { __html: '<a title="' + (val.creator && (val.creator.name + '(' + val.creator.email + ')')) + '">' + (val.creator && val.creator.id === currentUser.id ? '我' : val.creator.name) + '</a> - ' + (this.state.displayTimeFormat == 'absolute' ? moment.unix(val.created_at).format('YYYY/MM/DD HH:mm:ss') : getAgoAt(val.created_at, currentTime)) + (val.edited_flag == 1 ? '<span style="color:red"> - 已编辑</span>' : '') } } />
                { ((val.creator && currentUser.id === val.creator.id && permissions.indexOf('delete_self_comments') !== -1) 
                  || permissions.indexOf('delete_comments') !== -1) &&  
                <span className='comments-button comments-edit-button' style={ { float: 'right', marginLeft: '7px' } } onClick={ this.showDelComments.bind(this, val) } title='删除'><i className='fa fa-trash'></i></span> }
                { ((val.creator && currentUser.id === val.creator.id && permissions.indexOf('edit_self_comments') !== -1) 
                  || permissions.indexOf('edit_comments') !== -1) &&  
                <span className='comments-button comments-edit-button' style={ { marginLeft: '7px', float: 'right' } } onClick={ this.showEditComments.bind(this, val) } title='编辑'><i className='fa fa-pencil'></i></span> }
                { permissions.indexOf('add_comments') !== -1 && 
                <span className='comments-button comments-edit-button' style={ { marginLeft: '7px', float: 'right' } } onClick={ this.showAddReply.bind(this, val.id, {}) } title='回复'><i className='fa fa-reply'></i></span> }
              </div> ); 
              let contents = val.contents ? _.escape(val.contents) : '-';

              const images = contents.match(/!\[file\]\(http(s)?:\/\/(.*?)\)((\r\n)|(\n))?/ig);
              const imgFileUrls = [];
              if (images) {
                _.forEach(images, (pv, i) => {
                  const imgurls = pv.match(/http(s)?:\/\/([^\)]+)/ig);
                  const pattern = new RegExp('^http[s]?:\/\/[^\/]+(.+)$');
                  if (pattern.exec(imgurls[0])) {
                    const imgurl = RegExp.$1;
                    contents = contents.replace(pv, '<div><img class="inline-img" id="inlineimg-' + val.id + '-' + i + '" style="margin-bottom:5px; margin-right:10px;" src="' + imgurl + '/thumbnail"/></div>');
                    imgFileUrls.push(imgurl);
                  }
                });
                contents = contents.replace(/<\/div>(\s*?)<div>/ig, '');
              }

              const links = contents.match(/\[.*?\]\(.*?\)/ig);
              if (links) {
                _.forEach(links, (lv, i) => {
                  const pattern = new RegExp('^\\[([^\\]]*)\\]\\(([^\\)]*)\\)$');
                  if (pattern.exec(lv)) {
                    contents = contents.replace(lv, '<a target=\'_blank\' href=\'' + RegExp.$2 + '\'>' + RegExp.$1 + '</a>');
                  }
                });
              }

              _.map(val.atWho || [], (v) => {
                contents = contents.replace(eval('/@' + v.name + '/'), '<a title="' + v.name + '(' + v.email + ')' + '">@' + v.name + '</a>');
              });
              contents = contents.replace(/(\r\n)|(\n)/g, '<br/>'); 

              return (
                <Panel header={ header } key={ i } style={ { margin: '5px' } }>
                  <div 
                    onClick={ this.previewInlineImg.bind(this) } 
                    style={ { lineHeight: '24px', whiteSpace: 'pre-wrap', wordWrap: 'break-word' } } 
                    dangerouslySetInnerHTML={ { __html: contents } }/>

                  { inlinePreviewShow[val.id] &&
                  <Lightbox
                    mainSrc={  imgFileUrls[photoIndex] }
                    nextSrc={  imgFileUrls[(photoIndex + 1) % imgFileUrls.length] }
                    prevSrc={  imgFileUrls[(photoIndex + imgFileUrls.length - 1) % imgFileUrls.length] }
                    imageTitle=''
                    imageCaption=''
                    onCloseRequest={ () => { this.state.inlinePreviewShow[val.id] = false; this.setState({ inlinePreviewShow: this.state.inlinePreviewShow }) } }
                    onMovePrevRequest={ () => this.setState({ photoIndex: (photoIndex + imgFileUrls.length - 1) % imgFileUrls.length }) }
                    onMoveNextRequest={ () => this.setState({ photoIndex: (photoIndex + 1) % imgFileUrls.length }) } /> }

                  { val.reply && val.reply.length > 0 &&
                  <div className='reply-region'>
                    <ul className='reply-contents'>
                     { _.map(val.reply, (v, i) => {
                       let contents = v.contents ? _.escape(v.contents) : '-';

                       const images = contents.match(/!\[.*?\]\(http(s)?:\/\/(.*?)\)((\r\n)|(\n))?/ig);
                       const imgFileUrls = [];
                       if (images) {
                         _.forEach(images, (pv, i) => {
                           const imgurls = pv.match(/http(s)?:\/\/([^\)]+)/ig);
                           const pattern = new RegExp('^http[s]?:\/\/[^\/]+(.+)$');
                           pattern.exec(imgurls[0]);
                           const imgurl = RegExp.$1;
                           contents = contents.replace(pv, '<div><img class="inline-img" id="inlineimg-' + v.id + '-' + i + '" style="margin-bottom:5px; margin-right:10px;" src="' + imgurl + '/thumbnail"/></div>');
                           imgFileUrls.push(imgurl);
                         });
                         contents = contents.replace(/<\/div>(\s*?)<div>/ig, '');
                       }

                       const links = contents.match(/\[.*?\]\(.*?\)/ig);
                       if (links) {
                         _.forEach(links, (lv, i) => {
                           const pattern = new RegExp('^\\[([^\\]]*)\\]\\(([^\\)]*)\\)$');
                           if (pattern.exec(lv)) {
                             contents = contents.replace(lv, '<a target=\'_blank\' href=\'' + RegExp.$2 + '\'>' + RegExp.$1 + '</a>');
                           }
                         });
                       }

                       _.map(v.atWho || [], (value) => {
                         contents = contents.replace(eval('/@' + value.name + '/'), '<a title="' + value.name + '(' + value.email + ')' + '">@' + value.name + '</a>');
                       });
                       contents = contents.replace(/(\r\n)|(\n)/g, '<br/>'); 

                       return (
                       <li className='reply-contents-item'>
                         <div className='reply-item-header'>
                           <span dangerouslySetInnerHTML= { { __html: '<a title="' + (v.creator && (v.creator.name + '(' + v.creator.email + ')')) + '">' + (v.creator && v.creator.id === currentUser.id ? '我' : v.creator.name) + '</a> - ' + (this.state.displayTimeFormat == 'absolute' ? moment.unix(val.created_at).format('YYYY/MM/DD HH:mm:ss') : getAgoAt(val.created_at, currentTime)) + (v.edited_flag == 1 ? '<span style="color:red"> - 已编辑</span>' : '') } }/>
                           { ((v.creator && currentUser.id === v.creator.id && permissions.indexOf('delete_self_comments') !== -1)
                             || permissions.indexOf('delete_comments') !== -1) &&
                           <span className='comments-button comments-edit-button' style={ { marginLeft: '7px', float: 'right' } } onClick={ this.showDelReply.bind(this, val.id, v) } title='删除'><i className='fa fa-trash'></i></span> }
                           { ((v.creator && currentUser.id === v.creator.id && permissions.indexOf('edit_self_comments') !== -1) 
                             || permissions.indexOf('edit_comments') !== -1) && 
                           <span className='comments-button comments-edit-button' style={ { marginLeft: '7px', float: 'right' } } onClick={ this.showEditReply.bind(this, val.id, v) } title='编辑'><i className='fa fa-pencil'></i></span> }
                           { permissions.indexOf('add_comments') !== -1 && 
                           <span className='comments-button comments-edit-button' style={ { marginLeft: '7px', float: 'right' } } onClick={ this.showAddReply.bind(this, val.id, v.creator) } title='回复'><i className='fa fa-reply'></i></span> }
                         </div>
                         <div 
                           onClick={ this.previewInlineImg.bind(this) }
                           style={ { lineHeight: '24px', whiteSpace: 'pre-wrap', wordWrap: 'break-word' } } 
                           dangerouslySetInnerHTML={ { __html: contents } }/>
 
                           { inlinePreviewShow[v.id] &&
                           <Lightbox
                             mainSrc={  imgFileUrls[photoIndex] }
                             nextSrc={  imgFileUrls[(photoIndex + 1) % imgFileUrls.length] }
                             prevSrc={  imgFileUrls[(photoIndex + imgFileUrls.length - 1) % imgFileUrls.length] }
                             imageTitle=''
                             imageCaption=''
                             onCloseRequest={ () => { this.state.inlinePreviewShow[v.id] = false; this.setState({ inlinePreviewShow: this.state.inlinePreviewShow }) } }
                             onMovePrevRequest={ () => this.setState({ photoIndex: (photoIndex + imgFileUrls.length - 1) % imgFileUrls.length }) }
                             onMoveNextRequest={ () => this.setState({ photoIndex: (photoIndex + 1) % imgFileUrls.length }) } /> }

                       </li> ) } ) }
                    </ul>
                  </div> }
                </Panel>) } ) }
          </Col>
        </FormGroup>
        { this.state.editCommentsShow &&
          <EditCommentsModal show
            close={ () => { this.setState({ editCommentsShow: false }) } }
            data={ this.state.selectedComments }
            loading = { itemLoading }
            users ={ users }
            project ={ project }
            permissions ={ permissions }
            issue_id={ issue_id }
            edit={ editComments }
            i18n={ i18n }/> }
        { this.state.delReplyShow &&
          <DelReplyModal show
            close={ () => { this.setState({ delReplyShow: false }) } }
            data={ this.state.selectedComments }
            loading = { itemLoading }
            issue_id={ issue_id }
            edit={ editComments }
            i18n={ i18n }/> }
        { this.state.delCommentsShow &&
          <DelCommentsModal show
            close={ () => { this.setState({ delCommentsShow: false }) } }
            data={ this.state.selectedComments }
            loading = { itemLoading }
            issue_id={ issue_id }
            del={ delComments }
            i18n={ i18n }/> }
      </Form>
    );
  }
}
