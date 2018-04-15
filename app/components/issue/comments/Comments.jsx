import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Form, FormControl, FormGroup, ControlLabel, Col, Panel, Label } from 'react-bootstrap';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const $ = require('$');
const img = require('../../../assets/images/loading.gif');
const moment = require('moment');
const DelCommentsModal = require('./DelCommentsModal');
const DelReplyModal = require('./DelReplyModal');
const EditCommentsModal = require('./EditCommentsModal');

export default class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = { addCommentsShow: false, editCommentsShow: false, delCommentsShow: false, delReplyShow: false, selectedComments: {}, contents:  '', atWho: [] };
    this.addAtWho = this.addAtWho.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    permissions: PropTypes.array.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    indexComments: PropTypes.func.isRequired,
    addComments: PropTypes.func.isRequired,
    editComments: PropTypes.func.isRequired,
    delComments: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
    collection: PropTypes.array.isRequired,
    issue_id: PropTypes.string.isRequired
  }

  showCommentsInputor() {
    this.setState({ addCommentsShow: true });
  }

  showDelComments(data) {
    this.setState({ delCommentsShow: true, selectedComments: data });
  }

  showEditComments(data) {
    this.setState({ editCommentsShow: true, selectedComments: data, editType: 'comments' });
  }

  showDelReply(comments_id, data) {
    this.setState({ delReplyShow: true, selectedComments: _.extend(data, { comments_id }) });
  }

  showEditReply(comments_id, data) {
    this.setState({ editCommentsShow: true, selectedComments: _.extend(data, { comments_id }) });
  }

  showAddReply(comments_id, to) {
    this.setState({ editCommentsShow: true, selectedComments: { comments_id, to } });
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
    $('.comments-inputor textarea').on('inserted.atwho', function(event, flag, query) {
      self.setState({ contents: event.target.value });
    });
  }

  render() {
    const { i18n, permissions, currentUser, indexComments, collection, indexLoading, loading, itemLoading, delComments, editComments, users, issue_id } = this.props;

    return (
      <Form horizontal>
        <FormGroup>
          <Col sm={ 12 } className={ indexLoading && 'hide' } style={ { marginTop: '10px', marginBottom: '10px' } }>
            <div>
              <span className='comments-button' style={ { marginRight: '10px', float: 'right' } } disabled={ loading } onClick={ () => { indexComments(issue_id) } }><i className='fa fa-refresh'></i> 刷新</span>
              <span className='comments-button' style={ { marginRight: '10px', float: 'right' } } disabled={ loading } onClick={ this.showCommentsInputor.bind(this) }><i className='fa fa-comment-o'></i> 添加</span>
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
                placeholder='输入备注' />
            </div>
            <div style={ { textAlign: 'right', marginBottom: '10px' } }>
              <img src={ img } className={ loading ? 'loading' : 'hide' } />
              <Button style={ { marginLeft: '10px' } } onClick={ this.addComments.bind(this) } disabled={ loading || _.isEmpty(_.trim(this.state.contents)) }>添加</Button>
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
                <span dangerouslySetInnerHTML= { { __html: '<a title="' + (val.creator && (val.creator.name + '(' + val.creator.email + ')')) + '">' + (val.creator && val.creator.name || '') + '</a> 添加备注 - ' + (val.created_at && moment.unix(val.created_at).format('YY/MM/DD HH:mm:ss')) + (val.edited_flag == 1 ? '<span style="color:red"> - 已编辑</span>' : '') } } />
                { ((val.creator && currentUser.id === val.creator.id) || permissions.indexOf('manage_project') !== -1) &&  
                <span className='comments-button comments-edit-button' style={ { float: 'right' } } onClick={ this.showDelComments.bind(this, val) }><i className='fa fa-trash' title='删除'></i></span> }
                { ((val.creator && currentUser.id === val.creator.id) || permissions.indexOf('manage_project') !== -1) &&  
                <span className='comments-button comments-edit-button' style={ { marginRight: '10px', float: 'right' } } onClick={ this.showEditComments.bind(this, val) }><i className='fa fa-pencil' title='编辑'></i></span> }
              </div> ); 
              let contents = val.contents || '-';
              _.map(val.atWho || [], (v) => {
                contents = contents.replace(eval('/@' + v.name + '/'), '<a title="' + v.name + '(' + v.email + ')' + '">@' + v.name + '</a>');
              });
              contents = contents.replace(/(\r\n)|(\n)/g, '<br/>'); 

              return (
                <Panel header={ header } key={ i } style={ { margin: '5px' } }>
                  <div style={ { lineHeight: '24px', whiteSpace: 'pre-wrap', wordWrap: 'break-word' } } dangerouslySetInnerHTML={ { __html: contents } }/>
                  <div style={ { marginTop: '5px', fontSize: '12px' } }><span className='comments-button' onClick={ this.showAddReply.bind(this, val.id, {}) }><i className='fa fa-share'></i> 回复</span></div>
                  { val.reply && val.reply.length > 0 &&
                  <div className='reply-region'>
                    <ul className='reply-contents'>
                     { _.map(val.reply, (v, i) => {
                       let contents = v.contents || '-';
                       _.map(v.atWho || [], (value) => {
                         contents = contents.replace(eval('/@' + value.name + '/'), '<a title="' + value.name + '(' + value.email + ')' + '">@' + value.name + '</a>');
                       });
                       contents = contents.replace(/(\r\n)|(\n)/g, '<br/>'); 

                       return (
                       <li className='reply-contents-item'>
                         <div className='reply-item-header'>
                           <span dangerouslySetInnerHTML= { { __html: '<a title="' + (v.creator && (val.creator.name + '(' + val.creator.email + ')')) + '">' + (v.creator && v.creator.name || '') + '</a> 回复' + (v.to && v.to.name ? (' <a title="' + (v.to && v.to.nameAndEmail || '') + '">' + v.to.name + '</a>') : '') + ' - ' + (v.created_at && moment.unix(v.created_at).format('YY/MM/DD HH:mm:ss')) + (v.edited_flag == 1 ? '<span style="color:red"> - 已编辑</span>' : '') } }/>
                           { ((v.creator && currentUser.id === v.creator.id) || permissions.indexOf('manage_project') !== -1) &&  
                           <span className='comments-button comments-edit-button' style={ { marginRight: '10px', float: 'right' } } onClick={ this.showDelReply.bind(this, val.id, v) }><i className='fa fa-trash' title='删除'></i></span> }
                           { ((v.creator && currentUser.id === v.creator.id) || permissions.indexOf('manage_project') !== -1) &&  
                           <span className='comments-button comments-edit-button' style={ { marginRight: '10px', float: 'right' } } onClick={ this.showEditReply.bind(this, val.id, v) }><i className='fa fa-pencil' title='编辑'></i></span> }
                         </div>
                         <div style={ { lineHeight: '24px', whiteSpace: 'pre-wrap', wordWrap: 'break-word' } } dangerouslySetInnerHTML={ { __html: contents } }/>
                         <div style={ { fontSize: '12px' } }>
                           <span className='comments-button' onClick={ this.showAddReply.bind(this, val.id, v.creator) }><i className='fa fa-share'></i> 回复</span>
                         </div>
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
