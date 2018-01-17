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
    del: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
  }

  async confirm() {
    const { close, del, data } = this.props;
    close();
    const ecode = await del(data.id);
    if (ecode === 0) {
      notify.show('删除完成。', 'success', 2000);
    } else {
      notify.show('删除失败。', 'error', 2000);
    }
  }

  cancel() {
    const { close } = this.props;
    close();
  }

  render() {
    const { data } = this.props;

    return (
      <Modal { ...this.props } onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>删除字段 - { data.name }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          确认要删除此字段？
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ this.confirm }>确定</Button>
          <Button bsStyle='link' onClick={ this.cancel }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
