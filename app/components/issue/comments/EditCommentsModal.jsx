import React, { PropTypes, Component } from 'react';
import { Modal, Button, FormControl } from 'react-bootstrap';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const $ = require('$');
const img = require('../../../assets/images/loading.gif');

export default class EditCommentsModal extends Component {
  constructor(props) {
    super(props);

    const { data } = props;
    this.state = { 
      ecode: 0, 
      oldContents: data.id ? (data.contents || '') : ('@' + (data.to && data.to.name || '') + ' '), 
      contents: data.id ? (data.contents || '') : ('@' + (data.to && data.to.name || '') + ' '), 
      atWho: data.id ? _.map(data.atWho || [], 'id') : (data.to && data.to.id ? [ data.to.id ] : [])
    };
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    issue_id: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    users: PropTypes.array.isRequired,
    data: PropTypes.object.isRequired
  }

  async confirm() {
    const { i18n: { errMsg }, issue_id, close, edit, users, data } = this.props;

    const newAtWho = [];
    _.map(_.uniq(this.state.atWho), (val) => {
      const user = _.find(users, { id: val });
      if (this.state.contents.indexOf('@' + user.name) !== -1) {
        newAtWho.push(val);
      }
    });
    let ecode = 0;
    if (data.comments_id) {

      ecode = await edit(
        issue_id, 
        data.comments_id, 
        { contents: this.state.contents, 
          to: data.to || {}, 
          reply_id: data.id || '', 
          atWho: _.map(newAtWho, (v) => _.find(users, { id: v })), 
          operation: data.id ? 'editReply' : 'addReply' });

      this.setState({ ecode });
      if (ecode === 0) {
        close();
        if (data.id) {
          notify.show('已更新回复。', 'success', 2000);
        } else {
          notify.show('已添加回复。', 'success', 2000);
        }
      }
    } else {
      ecode = await edit(issue_id, data.id, { contents: this.state.contents, atWho: _.map(newAtWho, (v) => _.find(users, { id: v }) ) });
      this.setState({ ecode });
      if (ecode === 0) {
        close();
        notify.show('已更新备注。', 'success', 2000);
      }
    }
  }

  cancel() {
    const { close } = this.props;
    close();
  }

  componentDidMount() {
    $('.edit-comments-inputor textarea').focus();
  }

  componentDidUpdate() {
    const { users } = this.props;
    _.map(users || [], (v) => {
      v.nameAndEmail = v.name + '(' + v.email + ')';
      return v;
    });
    const self = this;
    $('.edit-comments-inputor textarea').atwho({
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
    $('.edit-comments-inputor textarea').one('inserted.atwho', function(event, flag, query) {
      self.setState({ contents: event.target.value });
    });
  }

  render() {
    const { i18n: { errMsg }, data, loading } = this.props;

    let title = '';
    if (data.id) {
      title = '编辑回复';
    } else {
      title = '回复 ' + (data.to && data.to.name ? data.to.name : '备注');
    }

    return (
      <Modal { ...this.props } onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ title }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='edit-comments-inputor'>
            <FormControl
              componentClass='textarea'
              disabled={ loading }
              style={ { height: '150px' } }
              onChange={ (e) => { this.setState({ contents: e.target.value }) } }
              value={ this.state.contents } />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !loading && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ loading ? 'loading' : 'hide' }/>
          <Button disabled={ this.state.oldContents === this.state.contents || loading } onClick={ this.confirm }>确定</Button>
          <Button bsStyle='link' disabled={ loading } onClick={ this.cancel }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
