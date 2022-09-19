import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

const logo = require('../../assets/images/brand.png');

export default class EncourageModal extends Component {
  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    close: PropTypes.func.isRequired
  }

  handleCancel() {
    const { close } = this.props;
    close();
  }

  render() {
    const { close } = this.props;

    return (
      <Modal show onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-la'>鼓励一下!</Modal.Title>
        </Modal.Header>
        <Modal.Body style={ { overflow: 'auto' } }>
          <div style={ { textAlign: 'left' } }>
            <span>如果ActionView对您的团队有所帮助，而且希望她未来更好，那就鼓励一下吧，谢谢！</span>
          </div>
          <div style={ { marginTop: '15px' } }>
            <iframe
              width='100%'
              height='350px'
              src='https://actionview.cn/www/encourage.html'
              frameBorder='0'
              scrolling='0' >
            </iframe>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ this.handleCancel }>关闭</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

