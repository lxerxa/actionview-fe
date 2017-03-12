import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { notify } from 'react-notify-toast';

const moment = require('moment');
const img = require('../../../assets/images/loading.gif');

export default class DelCommentsModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0 };
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  static propTypes = {
    issue_id: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired
  }

  async confirm() {
    const { issue_id, close, del, data } = this.props;
    const ecode = await del(issue_id, data.id);
    this.setState({ ecode: ecode });
    if (ecode === 0) {
      close();
      notify.show('备注已删除。', 'success', 2000);
    }
  }

  cancel() {
    const { close } = this.props;
    close();
  }

  render() {
    const { data, loading } = this.props;

    return (
      <Modal { ...this.props } onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>删除备注</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          此备注添加于 { moment.unix(data.created_at).format('YYYY/MM/DD HH:mm') }<br/><br/>
          确认要删除吗？
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !loading && 'aaaa' }</span>
          <img src={ img } className={ loading ? 'loading' : 'hide' }/>
          <Button disabled={ loading } onClick={ this.confirm }>确定</Button>
          <Button bsStyle='link' disabled={ loading } onClick={ this.cancel }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
