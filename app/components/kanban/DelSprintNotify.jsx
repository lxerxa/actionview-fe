import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { notify } from 'react-notify-toast';
import _ from 'lodash';

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
    loading: PropTypes.bool.isRequired,
    del: PropTypes.func.isRequired,
    sprintNo: PropTypes.number.isRequired
  }

  async confirm() {
    const { close, del, sprintNo } = this.props;
    const ecode = await del(sprintNo);
    this.setState({ ecode: ecode });

    if (ecode === 0) {
      close();
      notify.show('Sprint已删除。', 'success', 2000);
    }
  }

  cancel() {
    const { loading, close } = this.props;
    if (loading) {
      return;
    }
    close();
  }

  render() {
    const { i18n: { errMsg }, sprintNo, loading } = this.props;

    return (
      <Modal show onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>
            Delete - Sprint{ sprintNo }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          确认要删除此Sprint? <br/>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !loading && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ loading ? 'loading' : 'hide' }/>
          <Button disabled={ loading } onClick={ this.confirm }>Submit</Button>
          <Button bsStyle='link' disabled={ loading } onClick={ this.cancel }>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
