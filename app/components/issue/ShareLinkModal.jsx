import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

export default class ShareLinkModal extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    close: PropTypes.func.isRequired,
    issue: PropTypes.object.isRequired
  }

  render() {
    const { issue, close } = this.props;

    return (
      <Modal { ...this.props } onHide={ close } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>分享链接 - { issue.no }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ close }>关闭</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
