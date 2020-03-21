import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { notify } from 'react-notify-toast';

const img = require('../../assets/images/loading.gif');

export default class MultiDelNotify extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0 };
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    multiDel: PropTypes.func.isRequired,
    issueIds: PropTypes.array.isRequired
  }

  async confirm() {
    const { close, multiDel, issueIds } = this.props;
    const ecode = await multiDel({ method: 'delete', data: issueIds });
    this.setState({ ecode: ecode });
    if (ecode === 0) {
      close();
      notify.show('问题已删除。', 'success', 2000);
    }
  }

  cancel() {
    const { close } = this.props;
    close();
  }

  render() {
    const { i18n: { errMsg }, issueIds, loading } = this.props;

    return (
      <Modal show onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>批量删除问题</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          共选择问题 <b>{ issueIds.length }</b> 个，确认要删除这些问题？<br/>
          如果您完成了这些问题，通常是"解决"或者"关闭"问题，而不是删除。<br/>
          如果删除，这些问题的子任务也将一并被删除。<br/> 
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
