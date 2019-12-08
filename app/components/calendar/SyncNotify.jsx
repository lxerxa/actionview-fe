import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { notify } from 'react-notify-toast';

export default class SyncNotify extends Component {
  constructor(props) {
    super(props);
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  static propTypes = {
    close: PropTypes.func.isRequired,
    sync: PropTypes.func.isRequired,
    year: PropTypes.string.isRequired
  }

  async confirm() {
    const { close, sync, year } = this.props;
    close();
    const ecode = await sync(year);
    if (ecode === 0) {
      notify.show('同步完成。', 'success', 2000);    
    } else {
      notify.show('同步失败。', 'error', 2000);    
    }
  }

  cancel() {
    const { close } = this.props;
    close();
  }

  render() {
    const { year } = this.props;

    return (
      <Modal show onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>同步日历 - { year }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          同步数据来至接口：<a href={ 'http://timor.tech/api/holiday/year' + year }>{ 'http://timor.tech/api/holiday/' + year }</a>。<br/>
          同步后，该年度原有设置的日历将会被覆盖。<br/>
          确认要同步吗？
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ this.confirm }>确定</Button>
          <Button bsStyle='link' onClick={ this.cancel }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
