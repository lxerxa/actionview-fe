import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

export default class RemoveFromSprintNotify extends Component {
  constructor(props) {
    super(props);
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  static propTypes = {
    close: PropTypes.func.isRequired,
    issueNo: PropTypes.number.isRequired,
    removeFromSprint: PropTypes.func.isRequired
  }

  confirm() {
    const { close, removeFromSprint, issueNo } = this.props;
    removeFromSprint(issueNo);
    close();
  }

  cancel() {
    const { close } = this.props;
    close();
  }

  render() {
    const { issueNo } = this.props;

    return (
      <Modal show onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-la'>
            移出问题 - { issueNo }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          确认要将此问题移出该Sprint? <br/>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ this.confirm }>确定</Button>
          <Button bsStyle='link' onClick={ this.cancel }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
