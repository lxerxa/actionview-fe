import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import _ from 'lodash';

const $ = require('$');
const img = require('../../../assets/images/loading.gif');

export default class EditCommentsModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0, contents: props.data.contents || '', atWho: props.data.atWho || [] };
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  static propTypes = {
    close: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    users: PropTypes.array.isRequired,
    data: PropTypes.object.isRequired
  }

  async confirm() {
    const { close, edit, users, data } = this.props;

    const newAtWho = [];
    _.map(_.uniq(this.state.atWho), (val) => {
      const user = _.find(users, { id: val });
      if (this.state.contents.indexOf('@' + user.name) !== -1) {
        newAtWho.push(val);
      }
    });
    const ecode = await edit(data.id, { contents: this.state.contents, atWho: _.map(newAtWho, (v) => _.find(users, { id: v }) ) });
    if (ecode === 0) {
      this.setState({ addCommentsShow: false, contents: '', atWho: [] });
    } else {
      this.setState({ ecode: ecode });
    }
  }

  cancel() {
    const { close } = this.props;
    close();
  }

  componentDidUpdate() {
    const { users } = this.props;
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
    $('.edit-comments-inputor textarea').on('inserted.atwho', function(event, flag, query) {
      self.setState({ contents: event.target.value });
    });
  }

  render() {
    const { data, loading } = this.props;

    return (
      <Modal { ...this.props } onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>编辑备注</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='edit-comments-inputor'>
            <textarea style={ { height: '150px', width: '100%', borderColor: '#ccc', borderRadius: '4px' } } onChange={ (e) => { this.setState({ contents: e.target.value }) } } value={ this.state.contents } placeholder='输入备注'/>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !loading && 'aaaa' }</span>
          <img src={ img } className={ loading ? 'loading' : 'hide' }/>
          <Button className='ralign' disabled={ loading } onClick={ this.confirm }>确定</Button>
          <Button disabled={ loading } onClick={ this.cancel }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
