import React, { PropTypes, Component } from 'react';
import { Modal, Button, FormControl } from 'react-bootstrap';

const { BASENAME } = process.env;

export default class ShareLinkModal extends Component {
  constructor(props) {
    super(props);
    const protocol = window.location.protocol;
    const host = window.location.host;

    this.state = { url: protocol + '//' + host + BASENAME + '/project/' + props.project.key + '/issue?no=' + props.issue.no };
  }

  static propTypes = {
    close: PropTypes.func.isRequired,
    project: PropTypes.object.isRequired,
    issue: PropTypes.object.isRequired
  }

  copy() {
    document.getElementById('url').select();
    document.execCommand('Copy');

    const { close } = this.props;
    close();
  }

  render() {
    const { issue, close } = this.props;

    return (
      <Modal show onHide={ close } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>Share - { issue.no }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormControl
            id='url'
            componentClass='textarea'
            style={ { height: '100px' } }
            value={ this.state.url } />
        </Modal.Body>
        <Modal.Footer>
          <span style={ { marginRight: '20px', fontSize: '12px' } }>若当前浏览器不支持此复制功能，可手动复制以上链接。</span>
          <Button onClick={ this.copy.bind(this) }>Copy</Button>
          <Button bsStyle='link' onClick={ close }>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
