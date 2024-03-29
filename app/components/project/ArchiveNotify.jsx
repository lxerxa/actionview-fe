import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { notify } from 'react-notify-toast';

export default class ArchiveNotify extends Component {
  constructor(props) {
    super(props);
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  static propTypes = {
    close: PropTypes.func.isRequired,
    archive: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
  }

  async confirm() {
    const { close, archive, data } = this.props;
    close();
    const ecode = await archive(data.id);
    if (ecode === 0) {
      notify.show('项目已归档。', 'success', 2000);    
    } else {
      notify.show('归档失败。', 'error', 2000);    
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
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-la'>项目归档</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          归档后项目将变成完全只读。<br/>
          确认要将【{ data.name }】此项目归档？
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ this.confirm }>确定</Button>
          <Button bsStyle='link' onClick={ this.cancel }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
