import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { notify } from 'react-notify-toast';

export default class OperateNotify extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0 };
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  static propTypes = {
    close: PropTypes.func.isRequired,
    operate: PropTypes.string.isRequired,
    del: PropTypes.func.isRequired,
    invalidate: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
  }

  async confirm() {
    const { close, operate, del, invalidate, data } = this.props;
    close();

    let ecode = 0, msg = '';
    if (operate === 'del') {
      ecode = await del(data.id);
      msg = '目录已删除。'; 
    } else if (operate === 'validate') {
      ecode = await invalidate(data.id, 0);
      msg = '目录已启用。'; 
    } else if (operate === 'invalidate') {
      ecode = await invalidate(data.id, 1);
      msg = '目录已禁用。'; 
    } else {
      return;
    }
    if (ecode === 0) {
      notify.show(msg, 'success', 2000);    
    } else {
      notify.show('操作失败。', 'error', 2000);    
    }
  }

  cancel() {
    const { close } = this.props;
    close();
  }

  render() {
    const { operate, data } = this.props;
    let operateTitle = '';
    if (operate === 'del') {
      operateTitle = '目录删除'
    } else if (operate === 'validate') {
      operateTitle = '目录启用';
    } else if (operate === 'invalidate') {
      operateTitle = '目录禁用';
    } else {
      return <div/>;
    }

    return (
      <Modal show onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ operateTitle }</Modal.Title>
        </Modal.Header>
        { operate === 'del' && 
        <Modal.Body>
          目录被删除后，同步of用户信息也将被删除。<br/>
          是否删除【{ data.name }】该目录？
        </Modal.Body> }
        { operate === 'validate' &&
        <Modal.Body>
          是否启用【{ data.name }】该目录？
        </Modal.Body> }
        { operate === 'invalidate' &&
        <Modal.Body>
          禁用目录后，用户将不会自动同步，登录认证也将无效。<br/>
          是否禁用【{ data.name }】该目录？
        </Modal.Body> }
        <Modal.Footer>
          <Button onClick={ this.confirm }>Submit</Button>
          <Button bsStyle='link' onClick={ this.cancel }>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
