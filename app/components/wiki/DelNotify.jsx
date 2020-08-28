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
    reload: PropTypes.func,
    data: PropTypes.object.isRequired
  }

  async confirm() {
    const { close, del, data, reload } = this.props;
    close();
    const ecode = await del(data.id);
    if (ecode === 0) {
      notify.show((data.d == 1 ? '目录' : 'Document') + '已删除。', 'success', 2000);
      if (reload) {
        reload();
      }
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

    const obj = data.d == 1 ? '目录' : 'Document';

    return (
      <Modal show onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>Delete{ obj }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { obj }被删除后，将不可恢复。<br/>
          确认要删除【{ data.name }】该{ obj }？<br/>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ this.confirm }>Submit</Button>
          <Button bsStyle='link' onClick={ this.cancel }>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
