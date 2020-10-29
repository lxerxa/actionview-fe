import React, { PropTypes, Component } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import _ from 'lodash';

export default class UserListModal extends Component {
  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    close: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired
  }

  handleCancel() {
    const { close } = this.props;
    close();
  }

  render() {
    const { users } = this.props;

    return (
      <Modal show onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>人员列表</Modal.Title>
        </Modal.Header>
        <Modal.Body style={ { height: '420px', overflow: 'auto' } }>
          <div style={ { marginBottom: '10px' } }>
            共有 <strong>{ users.length }</strong> 人
          </div>
          { users.length > 0 &&
          <Table condensed hover responsive style={ { borderBottom: '1px solid #ddd' } }>
            <tbody>
            { _.map(users, (v, key) => {
              return (<tr key={ key }>
                <td>
                  <span>{ v.name }</span>
                  <span style={ { color: '#aaa' } }>{ ' - ' + v.email }</span>
                </td>
              </tr>); }) }
            </tbody>
          </Table> }
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ this.handleCancel }>关闭</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

