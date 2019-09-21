import React, { PropTypes, Component } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import _ from 'lodash';

const moment = require('moment');

export default class VersionViewModal extends Component {
  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    close: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired,
    versions: PropTypes.array.isRequired
  }

  handleCancel() {
    const { close } = this.props;
    close();
  }

  render() {
    const { versions, select, close } = this.props;

    return (
      <Modal show onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>历史版本</Modal.Title>
        </Modal.Header>
        <Modal.Body style={ { height: '420px', overflow: 'auto' } }>
          <Table hover responsive>
            <thead>
              <tr>
                <th>版本号</th>
                <th>详细纪录</th>
              </tr>
            </thead>
            <tbody>
            { _.map(versions || [], (v, key) => {
              return (<tr key={ key }>
                <td>
                  <div style={ { float: 'left' } }>
                    <a href='#' onClick={ (e) => { e.preventDefault(); select(v.version); close(); } }>{ v.version }</a>
                  </div>
                </td>
                <td>
                  <div style={ { float: 'left' } }>
                    { v.editor && v.editor.name ? v.editor.name : (v.creator && v.creator.name || '') }于 { v.updated_at ? moment.unix(v.updated_at).format('YYYY/MM/DD HH:mm') : moment.unix(v.created_at).format('YYYY/MM/DD HH:mm') } { v.version == 1 ? '创建' : '编辑' }。
                  </div>
                </td>
              </tr>); }) }
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ this.handleCancel }>关闭</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

