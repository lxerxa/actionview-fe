import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { notify } from 'react-notify-toast';

const moment = require('moment');

export default class CheckoutNotify extends Component {
  constructor(props) {
    super(props);
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  static propTypes = {
    close: PropTypes.func.isRequired,
    checkout: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
  }

  async confirm() {
    const { close, checkout, data } = this.props;
    close();
    const ecode = await checkout(data.id);
    if (ecode === 0) {
      notify.show('已解锁。', 'success', 2000);    
    } else {
      notify.show('解锁失败。', 'error', 2000);    
    }
  }

  cancel() {
    const { close } = this.props;
    close();
  }

  render() {
    const { data } = this.props;

    return (
      <Modal show onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>文档解锁</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { '该文档【' + data.name + '】被 ' + ( data.checkin.user ? data.checkin.user.name : '' ) + ' 于 ' + ( data.checkin.at ? moment.unix(data.checkin.at).format('YYYY/MM/DD HH:mm') : '' ) + ' 锁定。' }
          <br/>

          确认要解锁？<br/>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ this.confirm }>Submit</Button>
          <Button bsStyle='link' onClick={ this.cancel }>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
