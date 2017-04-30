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
    renew: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
  }

  async confirm() {
    const { close, operate, renew, del, data } = this.props;
    close();

    let ecode = 0, msg = '';
    if (operate === 'renew') {
      ecode = await renew(data.id);
      msg = '密码已重置。'; 
    } else {
      ecode = await del(data.id);
      msg = '用户已删除。'; 
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
    const operateTitle = operate === 'renew' ? '密码重置' : '用户删除';

    return (
      <Modal { ...this.props } onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ operateTitle } - { data.first_name }</Modal.Title>
        </Modal.Header>
        { operate === 'renew' && 
        <Modal.Body>
          是否将用户密码设置成系统默认值？
        </Modal.Body> }
        { operate === 'del' && 
        <Modal.Body>
          用户被删除后，项目中的用户也同时被删除。<br/>
          是否删除该用户？
        </Modal.Body> }
        <Modal.Footer>
          <Button onClick={ this.confirm }>确定</Button>
          <Button bsStyle='link' onClick={ this.cancel }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
