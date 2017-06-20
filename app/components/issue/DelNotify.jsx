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
    detailClose: PropTypes.func,
    loading: PropTypes.bool.isRequired,
    del: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
  }

  async confirm() {
    const { close, del, data, detailClose=null } = this.props;
    const ecode = await del(data.id);
    this.setState({ ecode: ecode });
    if (ecode === 0) {
      close();
      detailClose && detailClose();
      notify.show('问题已删除。', 'success', 2000);
    }
  }

  cancel() {
    const { close } = this.props;
    close();
  }

  render() {
    const { i18n: { errMsg }, data, loading } = this.props;

    return (
      <Modal { ...this.props } onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>删除问题 - { data.no }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          确认要删除此问题？<br/>
          如果你完成了这个问题，通常是"解决"或者"关闭"此问题，而不是删除。<br/>
          如果此问题有子任务也将一并被删除。<br/> 
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
