import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

const img = require('../../assets/images/loading.gif');

export default class LinkIssueModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0 };
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  static propTypes = {
    close: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    createLink: PropTypes.func.isRequired,
    src: PropTypes.string.isRequired
  }

  async confirm() {
    const { close, createLink, src } = this.props;
    const values = {};
    values.src = this.state.src;
    values.relation = this.state.relation;
    values.dest = this.state.dest;
    const ecode = await createLink(values);
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
    const { loading } = this.props;

    return (
      <Modal { ...this.props } onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>链接问题</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !loading && 'aaaa' }</span>
          <img src={ img } className={ loading ? 'loading' : 'hide' }/>
          <Button className='ralign' disabled={ loading } onClick={ this.confirm }>确定</Button>
          <Button disabled={ loading } onClick={ this.cancel }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
