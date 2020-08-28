import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { notify } from 'react-notify-toast';

const img = require('../../assets/images/loading.gif');

export default class OperateNotify extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0 };
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  static propTypes = {
    close: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    operation: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired
  }

  async confirm() {
    const { close, update, data, operation, loading } = this.props;
    let ecode = 0;

    if (operation == 'disable') {
      ecode = await update({ id: data.id, disabled: true });
      if (ecode === 0) {
        notify.show('禁用成功。', 'success', 2000);
      } else {
        notify.show('禁用失败。', 'error', 2000);
      }
    } else if (operation == 'enable') {
      ecode = await update({ id: data.id, disabled: false });
      if (ecode === 0) {
        notify.show('启用成功。', 'success', 2000);
      } else {
        notify.show('启用失败。', 'error', 2000);
      }
    }

    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
    } else {
      this.setState({ ecode: ecode });
    }
  }

  cancel() {
    const { close } = this.props;
    close();
  }

  render() {
    const { data, operation, loading } = this.props;

    let opt = '';
    if (operation == 'disable') {
      opt = 'disable';
    } else if (operation == 'enable') {
      opt = 'enable';
    }

    return (
      <Modal show onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ opt }方案 - { data.name }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Confirm{ opt }此方案？
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !loading && 'aaaa' }</span>
          <img src={ img } className={ loading ? 'loading' : 'hide' }/>
          <Button disabled={ loading } onClick={ this.confirm }>Submit</Button>
          <Button bsStyle='link' disabled={ loading } onClick={ this.cancel }>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
