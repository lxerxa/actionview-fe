import React, { PropTypes, Component } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import _ from 'lodash';

export default class WatcherListModal extends Component {
  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    close: PropTypes.func.isRequired,
    issue_no: PropTypes.number.isRequired,
    watchers: PropTypes.object.isRequired
  }

  handleCancel() {
    const { close } = this.props;
    close();
  }

  render() {
    const { watchers, issue_no } = this.props;

    return (
      <Modal { ...this.props } onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>关注者列表 - { issue_no }</Modal.Title>
        </Modal.Header>
        <Modal.Body style={ { height: '420px', overflow: 'auto' } }>
          <div style={ { marginBottom: '10px' } }>
            { watchers.length > 0 ?
            <span>共有关注者 <strong>{ watchers.length }</strong> 人</span>
            :
            <span>暂无关注者</span> }
          </div>
          { watchers.length > 0 &&
          <Table condensed hover responsive>
            <tbody>
            { _.map(watchers, (v, key) => {
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

