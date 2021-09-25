import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { notify } from 'react-notify-toast';
import _ from 'lodash';

const img = require('../../../assets/images/loading.gif');

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
    loading: PropTypes.bool.isRequired,
    model: PropTypes.string.isRequired,
    update: PropTypes.func.isRequired,
    no: PropTypes.number.isRequired,
    config: PropTypes.object.isRequired
  }

  async confirm() {
    const { close, update, no, model, config: { id, columns={}, filters={} } } = this.props;
    let ecode = 0;
    if (model === 'column') {
      const newColumns = _.filter(columns, (v) => { return v.no != no });
      ecode = await update({ id, columns: newColumns });
    } else if (model === 'filter') {
      const newFilters = _.filter(filters, (v) => { return v.no != no });
      ecode = await update({ id, filters: newFilters });
    }
    this.setState({ ecode });
    if (ecode === 0) {
      close();
      if (model === 'column') {
        notify.show('看板列已删除。', 'success', 2000);
      } else if (model === 'filter') {
        notify.show('过滤器已删除。', 'success', 2000);
      }
    }
  }

  cancel() {
    const { close } = this.props;
    close();
  }

  render() {
    const { i18n: { errMsg }, model, no, loading, config } = this.props;

    return (
      <Modal show onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-la'>
            { model === 'column' && ('删除列 - ' + (_.find(config.columns, { no }) && _.find(config.columns, { no }).name || '')) } 
            { model === 'filter' && ('删除过滤器 - ' +  (_.find(config.filters, { no }) && _.find(config.filters, { no }).name || '')) }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          确认要删除此{ model === 'column' && '列' }{ model === 'filter' && '过滤器' }? <br/>
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
