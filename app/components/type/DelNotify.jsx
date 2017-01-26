import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

const img = require('../../assets/images/loading.gif');

export default class DelNotify extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0 };
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  static propTypes = {
    close: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
    operation: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired
  }

  async confirm() {
    const { close, del, edit, data, operation, loading } = this.props;
    let ecode = 0;

    if (operation == 'disable') {
      ecode = await edit({ id: data.id, disabled: true });
    } else if (operation == 'enable') {
      ecode = await edit({ id: data.id, disabled: false });
    } else {
      ecode = await del(data.id);
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
    const { data, operation, loading } = this.props;

    let opt = '';
    if (operation == 'disable') {
      opt = '禁用';
    } else if (operation == 'enable') {
      opt = '启用';
    } else {
      opt = '删除';
    }

    return (
      <Modal { ...this.props } onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ opt }问题类型 - { data.name }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          确认要{ opt }此问题类型？
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !loading && 'aaaa' }</span>
          <img src={ img } className={ loading ? 'loading' : 'hide' }/>
          <Button disabled={ loading } onClick={ this.confirm }>确定</Button>
          <Button bsStyle='link' disabled={ loading } onClick={ this.cancel }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
