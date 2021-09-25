import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { notify } from 'react-notify-toast';

const img = require('../../assets/images/loading.gif');

export default class DelNotify extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0 };
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    operation: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired
  }

  async confirm() {
    const { close, del, update, data, operation, loading } = this.props;
    let ecode = 0;

    if (operation == 'disable') {
      ecode = await update({ id: data.id, disabled: true });
      if (ecode === 0) {
        notify.show('禁用成功。', 'success', 2000);
      } else {
        notify.show('禁用失败。', 'error', 2000);
      }
    } else if (operation == 'enable') {
      ecode = await update({ id: data.id, disabled: false });
      if (ecode === 0) {
        notify.show('启用成功。', 'success', 2000);
      } else {
        notify.show('启用失败。', 'error', 2000);
      }
    } else {
      ecode = await del(data.id);
      if (ecode === 0) {
        notify.show('删除完成。', 'success', 2000);
      } else {
        notify.show('删除失败。', 'error', 2000);
      }
    }

    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
    } else {
      this.setState({ ecode: ecode });
    }
  }

  cancel() {
    const { close } = this.props;
    close();
  }

  render() {
    const { i18n: { errMsg }, data, operation, loading } = this.props;

    let opt = '';
    if (operation == 'disable') {
      opt = '禁用';
    } else if (operation == 'enable') {
      opt = '启用';
    } else {
      opt = '删除';
    }

    return (
      <Modal show onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-la'>{ opt }问题类型 - { data.name }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          确认要{ opt }此问题类型？
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !loading && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ loading ? 'loading' : 'hide' }/>
          <Button disabled={ loading } onClick={ this.confirm }>确定</Button>
          <Button bsStyle='link' disabled={ loading } onClick={ this.cancel }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
