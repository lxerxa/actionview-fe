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
    del: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
  }

  confirm() {
    const { close, del, data } = this.props;
    close();
    del(data.id);
  }

  cancel() {
    const { close } = this.props;
    close();
  }

  render() {
    const { data } = this.props;

    return (
      <Modal { ...this.props } onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0' } }>
          <Modal.Title id='contained-modal-title-la'>删除界面 - { data.name }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          确认要删除此界面？
        </Modal.Body>
        <Modal.Footer>
          <Button className='ralign' onClick={ this.confirm }>确定</Button>
          <Button onClick={ this.cancel }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
