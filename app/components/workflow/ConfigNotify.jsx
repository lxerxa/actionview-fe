import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { notify } from 'react-notify-toast';

export default class ConfigNotify extends Component {
  constructor(props) {
    super(props);
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  static propTypes = {
    close: PropTypes.func.isRequired,
    save: PropTypes.func,
    cancel: PropTypes.func
  }

  async confirm() {
    const { close, save=null, cancel=null } = this.props;
    close();

    if (cancel) {
      cancel();
    } else {
      const ecode = await save();
      if (ecode === 0) {
        notify.show('已保存。', 'success', 2000);
      } else {
        notify.show('保存失败。', 'error', 2000);
      }
    }
  }

  cancel() {
    const { close } = this.props;
    close();
  }

  render() {
    const { cancel } = this.props;

    return (
      <Modal { ...this.props } onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ cancel ? '配置取消' : '配置保存' }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <br/>
          { cancel ? '确认要放弃修改吗？' : '配置可能存在无法到达的结点，确认要继续保存吗？' }
          <br/>
          <br/>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ this.confirm }>确定</Button>
          <Button bsStyle='link' onClick={ this.cancel }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
