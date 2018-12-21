import React, { PropTypes, Component } from 'react';
import { Modal, Button, Checkbox } from 'react-bootstrap';
import { notify } from 'react-notify-toast';
import _ from 'lodash';

const img = require('../../assets/images/loading.gif');

export default class CompleteNotify extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0, isSendMsg: true };
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    sprintNo: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    completedIssues: PropTypes.func.isRequired,
    complete: PropTypes.func.isRequired
  }

  async confirm() {
    const { close, complete, sprintNo, completedIssues } = this.props;
    const ecode = await complete({ completed_issues: _.map(completedIssues, (v) => v.no), isSendMsg: this.state.isSendMsg }, sprintNo);
    this.setState({ ecode: ecode });

    if (ecode === 0) {
      close();
      notify.show('Sprint ' + sprintNo + ' 已置完成。', 'success', 2000);
    }
  }

  cancel() {
    const { close } = this.props;
    close();
  }

  render() {
    const { i18n: { errMsg }, total, completedIssues, loading } = this.props;

    return (
      <Modal { ...this.props } onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>
            完成Sprint
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { total - completedIssues.length > 0 && '还有 ' + (total - completedIssues.length) + ' 个问题未完成，' }
          确认要置完成此Sprint? <br/>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !loading && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ loading ? 'loading' : 'hide' }/>
          <Checkbox
            disabled={ loading }
            checked={ this.state.isSendMsg }
            onClick={ () => { this.setState({ isSendMsg: !this.state.isSendMsg }) } }
            style={ { display: 'inline-block', marginRight: '20px', marginLeft: '10px' } }>
            通知项目成员
          </Checkbox>
          <Button disabled={ loading } onClick={ this.confirm }>确定</Button>
          <Button bsStyle='link' disabled={ loading } onClick={ this.cancel }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
