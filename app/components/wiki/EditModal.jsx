import React, { PropTypes, Component } from 'react';
import { Modal, Form, InputGroup, Button, ControlLabel, FormControl, FormGroup, HelpBlock, Checkbox } from 'react-bootstrap';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const SimpleMDE = require('SimpleMDE');
const img = require('../../assets/images/loading.gif');

let simplemde = {};

export default class EditModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0, emsg: '', name: '', contents: '', touched: false, isSendMsg: true };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    path: PropTypes.array.isRequired,
    wid: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    checkin: PropTypes.func.isRequired,
    get: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired
  }

  async handleSubmit() {
    const { update, wid, close } = this.props;
    const ecode = await update(wid, { name: this.state.name, contents: simplemde.value(), isSendMsg: this.state.isSendMsg });
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('已更新。', 'success', 2000);
    } else {
      this.setState({ ecode: ecode });
    }
  }

  handleCancel() {
    const { close, loading } = this.props;
    if (loading) {
      return;
    }
    this.setState({ ecode: 0 });
    close();
  }

  async componentWillMount() {
    const { checkin, get, wid } = this.props;
    // lock the wiki
    await checkin(wid);

    const ecode = await get(wid);
    if (ecode !== 0) {
      this.state.emsg = '获取文档信息失败。';
      this.setState({ emsg : this.state.emsg });
    } else {
      const { data, user } = this.props; 
      if (_.isEmpty(data.checkin)) {
        this.state.emsg = '其他人可能正在编辑该文档，暂不能编辑提交。';
      } else if (data.checkin.user.id !== user.id) {
        this.state.emsg = data.checkin.user.name + ' 正编辑该文档，暂不能编辑提交。';
      }
      this.setState({ name: data.name || '', emsg : this.state.msg });
      simplemde.value(data.contents || '');
    }
  }

  componentDidMount() {
    const fileeditDOM = document.getElementById('fileedit');
    if (fileeditDOM) {
      simplemde = new SimpleMDE({ element: fileeditDOM, autoDownloadFontAwesome: false, showIcons: ['table'], hideIcons: ['side-by-side', 'fullscreen'], spellChecker: false, status: false });
    }
  }

  render() {
    const { i18n: { errMsg }, itemLoading, loading, path } = this.props;

    return (
      <Modal show onHide={ this.handleCancel } bsSize='large' backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-la'>编辑文档</Modal.Title>
        </Modal.Header>
        <Modal.Body style={ { height: '580px', overflow: 'auto', display: !itemLoading ? 'none' : '' } }>
          <div style={ { marginTop: '250px', textAlign: 'center' } }>
            <img src={ img } className='loading'/>
          </div>
        </Modal.Body>
        <Modal.Body style={ { height: '580px', overflow: 'auto', display: itemLoading ? 'none' : '' } }>
          <FormGroup style={ { marginTop: '0px' } } validationState={ this.state.touched && !this.state.name && 'error' || null }>
            <InputGroup>
              <InputGroup.Button>
                <Button> / { _.map(path, (v) => v.id === '0' ? '' : (v.name + ' / ')) }</Button>
              </InputGroup.Button>
              <FormControl 
                disabled={ loading } 
                type='text'
                value={ this.state.name } 
                onChange={ (e) => { this.setState({ name: e.target.value }) } } 
                onBlur={ (e) => { this.setState({ touched: true }) } }
                placeholder='请输入标题名'/>
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <textarea name='field' id='fileedit'></textarea>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !loading ? errMsg[this.state.ecode] : this.state.emsg }</span>
          <img src={ img } className={ loading ? 'loading' : 'hide' }/>
          <Checkbox
            disabled={ loading }
            checked={ this.state.isSendMsg }
            onClick={ () => { this.setState({ isSendMsg: !this.state.isSendMsg }) } }
            style={ { display: 'inline-block', marginRight: '20px', marginLeft: '10px' } }>
            通知项目成员
          </Checkbox>
          <Button disabled={ this.state.emsg || loading || !this.state.name } onClick={ this.handleSubmit }>确定</Button>
          <Button bsStyle='link' disabled={ loading } onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
