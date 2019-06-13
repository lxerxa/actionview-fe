import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { notify } from 'react-notify-toast';

const img = require('../../assets/images/loading.gif');

export default class MultiOperateNotify extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0 };
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    ids: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    operate: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired,
    cancelSelected: PropTypes.func.isRequired,
    multiReopen: PropTypes.func.isRequired,
    multiStop: PropTypes.func.isRequired,
    multiCreateIndex: PropTypes.func.isRequired
  }

  async confirm() {
    const { multiStop, multiReopen, multiCreateIndex, cancelSelected, ids=[], operate, close } = this.props;

    if (ids.length <= 0) {
      return;
    }

    let ecode = 0, msg = '';
    if (operate == 'reopen') {
      ecode = await multiReopen(ids);
      msg = '项目已打开。'; 
    } else if (operate == 'close') {
      ecode = await multiStop(ids);
      msg = '项目已关闭。'; 
    } else if (operate == 'create_index') {
      ecode = await multiCreateIndex(ids);
      msg = '索引已创建。'; 
    }
    if (ecode === 0) {
      close();
      cancelSelected();
      notify.show(msg, 'success', 2000);    
    } else {
      notify.show('操作失败。', 'error', 2000);    
    }
    this.setState({ ecode: ecode });
  }

  cancel() {
    const { close, loading } = this.props;
    if (loading) {
      return;
    }
    this.setState({ ecode: 0 });
    close();
  }

  render() {
    const { i18n: { errMsg }, operate, loading } = this.props;
    const operateTitle = operate === 'reopen' ? '重新打开' : (operate === 'create_index' ? '重新索引' : '关闭');

    return (
      <Modal show onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>批处理项目 - { operateTitle }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { '确认要 ' + operateTitle + ' 选中的项目？' }
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !loading && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ loading ? 'loading' : 'hide' }/>
          <Button onClick={ this.confirm }>确定</Button>
          <Button bsStyle='link' disabled={ loading } onClick={ this.cancel }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
