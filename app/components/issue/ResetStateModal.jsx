import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

const img = require('../../assets/images/loading.gif');

export default class ResetStateModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0 };
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  static propTypes = {
    close: PropTypes.func.isRequired,
    resetState: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    issue: PropTypes.object.isRequired
  }

  async confirm() {
    const { close, resetState, issue } = this.props;
    const ecode = await resetState(issue.id);
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
    const { issue, loading } = this.props;

    return (
      <Modal { ...this.props } onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ '重置状态 - ' + issue.no }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          确认要重置此问题状态？<br/>
          如果你重置了这个问题，原来的流程信息将会丢失，状态会初始化为开始值，解决结果 变为 未解决。<br/>
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
