import React, { PropTypes, Component } from 'react';
import { Modal, Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import _ from 'lodash';
import { FieldTypes } from '../share/Constants';

export default class PreviewModal extends Component {
  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    close: PropTypes.func.isRequired,
    name: PropTypes.string,
    data: PropTypes.array.isRequired
  }

  handleCancel() {
    const { close } = this.props;
    close();
  }

  render() {
    const { data, name } = this.props;

    return (
      <Modal show onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>预览界面{ name ? (' - ' + name) : '' }</Modal.Title>
        </Modal.Header>
        <Modal.Body style={ { height: '420px', overflow: 'auto' } }>
          <ListGroup>
            { _.map(data, (val, key) => 
              <ListGroupItem header={ val.name || '' }>
              { 'Key value:' + (val.key || '-') + ' - Type:' + (_.find(FieldTypes, { value: val.type }) ? _.find(FieldTypes, { value: val.type }).label : '') + (val.required ? ' - Required' : '') }
              </ListGroupItem> ) }
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ this.handleCancel }>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
