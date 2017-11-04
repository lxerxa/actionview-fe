import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { notify } from 'react-notify-toast';
import _ from 'lodash';

const img = require('../../../assets/images/loading.gif');

export default class DelNotify extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0, data: {} };
    this.state.data = _.clone(this.props.config);
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
    const { close, update, no, model } = this.props;
    const { data: { id, columns={}, filters={} } } = this.state;
    let ecode = 0;
    if (model === 'column') {
      const ind = _.findIndex(columns, { no });
      columns.splice(ind, 1);
      ecode = await update({ id, columns });
    } else if (model === 'filter') {
      const ind = _.findIndex(filters, { no });
      filters.splice(ind, 1);
      ecode = await update({ id, filters });
    }
    this.setState({ ecode: ecode });
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
    const { i18n: { errMsg }, model, no, loading } = this.props;
    const { data } = this.state;

    return (
      <Modal { ...this.props } onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ model === 'column' && ('删除列 - ' + _.find(data.columns, { no }).name) } { model === 'filter' && ('删除过滤器 - ' +  _.find(data.filters, { no }).name) }</Modal.Title>
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
