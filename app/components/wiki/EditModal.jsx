import React, { PropTypes, Component } from 'react';
import { Modal, Form, InputGroup, Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const SimpleMDE = require('SimpleMDE');
const img = require('../../assets/images/loading.gif');

let simplemde = {};

export default class EditModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0, name: '', contents: '', touched: false };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    path: PropTypes.array.isRequired,
    wid: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    get: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired
  }

  async handleSubmit() {
    const { update, wid, close } = this.props;
    const ecode = await update(wid, { name: this.state.name, contents: simplemde.value() });
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
    const { get, wid } = this.props;
    const ecode = await get(wid);
    if (ecode !== 0) {
      notify.show('获取文档信息失败。', 'error', 2000);
    } else {
      const { data } = this.props; 
      this.setState({ name: data.name || '' });
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
      <Modal { ...this.props } onHide={ this.handleCancel } bsSize='large' backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>编辑文档</Modal.Title>
        </Modal.Header>
        <Modal.Body style={ { height: '580px', overflow: 'auto', display: !itemLoading ? 'none' : '' } }>
          <div style={ { marginTop: '250px', textAlign: 'center' } }>
            <img src={ img } className='loading'/>
          </div>
        </Modal.Body>
        <Modal.Body style={ { height: '580px', overflow: 'auto', display: itemLoading ? 'none' : '' } }>
          <FormGroup style={ { marginTop: '0px' } } validationState={ this.state.touched && !this.state.name && 'error' || '' }>
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
          <span className='ralign'>{ this.state.ecode !== 0 && !loading && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ loading ? 'loading' : 'hide' }/>
          <Button disabled={ loading || !this.state.name } onClick={ this.handleSubmit }>确定</Button>
          <Button bsStyle='link' disabled={ loading } onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
