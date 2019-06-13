import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { notify } from 'react-notify-toast';

export default class DelNotify extends Component {
  constructor(props) {
    super(props);
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  static propTypes = {
    close: PropTypes.func.isRequired,
    del: PropTypes.func,
    reset: PropTypes.func,
    data: PropTypes.object.isRequired
  }

  async confirm() {
    const { close, del=null, reset=null, data } = this.props;
    let ecode = 0;
    close();
    if (reset) {
      ecode = await reset(data.id);
      if (ecode === 0) {
        notify.show('重置完成。', 'success', 2000);
      } else {
        notify.show('重置失败。', 'error', 2000);
      }
    } else  {
      ecode = await del(data.id);
      if (ecode === 0) {
        notify.show('删除成功。', 'success', 2000);
      } else {
        notify.show('删除失败。', 'success', 2000);
      }
    }
  }

  cancel() {
    const { close } = this.props;
    close();
  }

  render() {
    const { data, reset=null, del=null } = this.props;

    return (
      <Modal show onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ reset ? '重置' : '删除' }通知事件 - { data.name }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { reset ? '确认要重置此事件？' : '确认要删除此事件？' }
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ this.confirm }>确定</Button>
          <Button bsStyle='link' onClick={ this.cancel }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
