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
    i18n: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
  }

  async confirm() {
    const { i18n: { errMsg }, close, del, data } = this.props;
    close();
    const ecode = await del(data.id);
    if (ecode === 0) {
      notify.show((data.d == 1 ? '目录' : '文档') + '已删除。', 'success', 2000);    
    } else {
      notify.show(errMsg[ecode] + '，删除失败。', 'error', 2000);    
    }
  }

  cancel() {
    const { close } = this.props;
    close();
  }

  render() {
    const { data } = this.props;

    const obj = data.d == 1 ? '目录' : '文档';

    return (
      <Modal show onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-la'>删除{ obj }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { obj }被删除后，将不可恢复。<br/>
          确认要删除【{ data.name }】该{ obj }？<br/>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ this.confirm }>确定</Button>
          <Button bsStyle='link' onClick={ this.cancel }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
