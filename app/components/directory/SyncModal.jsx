import React, { PropTypes, Component } from 'react';
import { Modal, Button, Label } from 'react-bootstrap';

const img = require('../../assets/images/loading.gif');

export default class SyncModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0 };
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    sync: PropTypes.func.isRequired,
    syncInfo: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
  }

  handleCancel() {
    const { close, loading } = this.props;
    if (loading) {
      return;
    }
    this.setState({ ecode: 0 });
    close();
  }

  componentWillMount() {
    const { sync, data } = this.props;
    sync(data.id);
  }

  resync() {
    const { sync, data } = this.props;
    sync(data.id);
  }

  render() {
    const { loading, syncInfo={}, data } = this.props;

    return (
      <Modal show onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>用户同步 - { data.name }</Modal.Title>
        </Modal.Header>
        { loading &&
        <Modal.Body style={ { height: '240px', overflow: 'auto' } }>
          <div style={ { textAlign: 'center', marginTop: '75px' } }>
            <img src={ img } className='loading'/><br/>
            正在同步中...
          </div>
        </Modal.Body> }
        { !loading &&
        <Modal.Body style={ { height: '240px', overflow: 'auto' } }>
          <br/>
          <br/>
          <table style={ { marginLeft: '20px' } }>
            <tr>
              <td style={ { height: '35px', textAlign: 'right' } }>同步用户：</td>
              <td>{ syncInfo.user ? <Label bsStyle='success'>Completed</Label> : <Label bsStyle='danger'>失败</Label> }</td>
            </tr>
            <tr>
              <td style={ { height: '35px', textAlign: 'right' } }>同步用户组：</td>
              <td>{ syncInfo.group ? <Label bsStyle='success'>Completed</Label> : <Label bsStyle='danger'>失败</Label> }</td>
            </tr>
          </table>
        </Modal.Body> }
        <Modal.Footer>
          <Button disabled={ loading } bsStyle='link' onClick={ this.resync.bind(this) }>重新同步</Button>
          <Button disabled={ loading } onClick={ this.handleCancel }>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
