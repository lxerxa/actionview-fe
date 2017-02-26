import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

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

  confirm() {
    const { close, del=null, reset=null, data } = this.props;
    close();
    if (reset) {
      reset(data.id);
    } else  {
      del(data.id);
    }
  }

  cancel() {
    const { close } = this.props;
    close();
  }

  render() {
    const { data, reset=null, del=null } = this.props;

    return (
      <Modal { ...this.props } onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
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
