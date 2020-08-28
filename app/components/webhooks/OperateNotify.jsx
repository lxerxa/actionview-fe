import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { notify } from 'react-notify-toast';

export default class OperateNotify extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0 };
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  static propTypes = {
    close: PropTypes.func.isRequired,
    operate: PropTypes.string.isRequired,
    del: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
  }

  async confirm() {
    const { close, operate, del, update, data } = this.props;
    close();

    let ecode = 0, msg = '';
    if (operate === 'del') {
      ecode = await del(data.id);
      msg = '已删除。'; 
    } else if (operate === 'enable') {
      ecode = await update(data.id, { status: 'enabled' });
      msg = '已启用。'; 
    } else if (operate === 'disable') {
      ecode = await update(data.id, { status: 'disabled' });
      msg = '已禁用。'; 
    } else {
      return;
    }
    if (ecode === 0) {
      notify.show(msg, 'success', 2000);    
    } else {
      notify.show('操作失败。', 'error', 2000);    
    }
  }

  cancel() {
    const { close } = this.props;
    close();
  }

  render() {
    const { operate, data } = this.props;

    let operateTitle = '';
    if (operate === 'del') {
      operateTitle = 'Webhook删除'
    } else if (operate === 'enable') {
      operateTitle = 'Webhook启用';
    } else if (operate === 'disable') {
      operateTitle = 'Webhook禁用';
    } else {
      return <div/>;
    }
    
    return (
      <Modal show onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ operateTitle }</Modal.Title>
        </Modal.Header>
        { operate === 'del' && 
        <Modal.Body>
          是否删除【{ data.request_url }】该Webhook？
        </Modal.Body> }
        { operate === 'enable' &&
        <Modal.Body>
          是否启用【{ data.request_url }】该Webhook？
        </Modal.Body> }
        { operate === 'disable' &&
        <Modal.Body>
          是否禁用【{ data.request_url }】该Webhook？
        </Modal.Body> }
        <Modal.Footer>
          <Button onClick={ this.confirm }>Submit</Button>
          <Button bsStyle='link' onClick={ this.cancel }>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
