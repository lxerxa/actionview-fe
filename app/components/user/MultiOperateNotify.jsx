import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import _ from 'lodash';
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
    collection: PropTypes.array.isRequired,
    ids: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    operate: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired,
    cancelSelected: PropTypes.func.isRequired,
    multiRenew: PropTypes.func.isRequired,
    multiInvalidate: PropTypes.func.isRequired,
    multiDel: PropTypes.func.isRequired
  }

  async confirm() {
    const { multiInvalidate, multiRenew, multiDel, cancelSelected, collection, ids=[], operate, close } = this.props;

    if (ids.length <= 0) {
      return;
    }

    let ecode = 0, msg = '', newIds = [];
    if (operate == 'renew') {
      ecode = await multiRenew(ids);
      msg = '密码已重置。'; 
    } else if (operate == 'validate') {
      newIds = _.map(_.filter(collection, (v) => (!v.directory || v.directory == 'self') && v.status == 'invalid' && ids.indexOf(v.id) !== -1), (v) => v.id);
      ecode = await multiInvalidate(newIds, 0);
      msg = '用户已启用。'; 
    } else if (operate == 'invalidate') {
      newIds = _.map(_.filter(collection, (v) => (!v.directory || v.directory == 'self') && v.status == 'active' && ids.indexOf(v.id) !== -1), (v) => v.id);
      ecode = await multiInvalidate(newIds, 1);
      msg = '用户已禁用。'; 
    } else if (operate == 'del') {
      newIds = _.map(_.filter(collection, (v) => (!v.directory || v.directory == 'self') && ids.indexOf(v.id) !== -1), (v) => v.id);
      ecode = await multiDel(newIds);
      msg = '用户已删除。'; 
    }
    if (ecode === 0) {
      close();
      cancelSelected();
      notify.show(msg, 'success', 2000);    
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
    const { i18n: { errMsg }, operate, loading, collection, ids } = this.props;
    let operateTitle = '';
    if (operate === 'renew') {
      operateTitle = '密码重置';
    } else if (operate === 'del') {
      operateTitle = '用户删除'
    } else if (operate === 'validate') {
      operateTitle = '用户启用';
    } else if (operate === 'invalidate') {
      operateTitle = '用户禁用';
    } else {
      return <div/>;
    }

    return (
      <Modal show onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>批处理用户 - { operateTitle }</Modal.Title>
        </Modal.Header>
        { operate === 'renew' && 
        <Modal.Body>
          是否重置选中用户的密码？
        </Modal.Body> }
        { operate === 'invalidate' &&
        <Modal.Body>
          共选中用户 <span style={ { fontWeight: 'bold' } }>{ ids.length }</span> 个，
          其中可被禁用用户 <span style={ { fontWeight: 'bold', color: 'red' } }>{ _.filter(collection, (v) => (!v.directory || v.directory == 'self') && v.status == 'active' && ids.indexOf(v.id) !== -1).length }</span> 个。<br/>
          是否禁用？<br/><br/>
          注：此操作对从外部用户目录同步过来的用户无效。
        </Modal.Body> }
        { operate === 'validate' &&
        <Modal.Body>
          共选中用户 <span style={ { fontWeight: 'bold' } }>{ ids.length }</span> 个，
          其中可被启用用户 <span style={ { fontWeight: 'bold', color: 'red' } }>{ _.filter(collection, (v) => (!v.directory || v.directory == 'self') && v.status == 'invalid' && ids.indexOf(v.id) !== -1).length }</span> 个。<br/>
          是否启用？<br/><br/>
          注：此操作对从外部用户目录同步过来的用户无效。
        </Modal.Body> }
        { operate === 'del' && 
        <Modal.Body>
          用户被删除后，项目中的用户也同时被删除。<br/>
          共选中用户 <span style={ { fontWeight: 'bold' } }>{ ids.length }</span> 个，
          其中可被删除用户 <span style={ { fontWeight: 'bold', color: 'red' } }>{ _.filter(collection, (v) => (!v.directory || v.directory == 'self') && ids.indexOf(v.id) !== -1).length }</span> 个。<br/>
          是否删除？<br/><br/>
          注：此操作对从外部用户目录同步过来的用户无效。
        </Modal.Body> }
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
