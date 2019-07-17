import React, { PropTypes, Component } from 'react';
import { Modal, Form, InputGroup, Button, ControlLabel, FormControl, FormGroup, Checkbox } from 'react-bootstrap';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const SimpleMDE = require('SimpleMDE');
const img = require('../../assets/images/loading.gif');

let simplemde = {};

export default class CreateModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0, name: '', touched: false, isSendMsg: true };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    path: PropTypes.array.isRequired,
    isHome: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired
  }

  async handleSubmit() {
    const { create, close } = this.props;
    const ecode = await create({ name: this.state.name, contents: simplemde.value(), isSendMsg: this.state.isSendMsg });
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('新建完成。', 'success', 2000);
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

  componentWillMount() {
    const { isHome } = this.props;
    if (isHome) {
      this.state.name = 'Home';
    }
  }

  componentDidMount() {
    const fileeditDOM = document.getElementById('fileedit');
    if (fileeditDOM) {
      simplemde = new SimpleMDE({ 
        element: fileeditDOM,
        previewRender: (text) => simplemde.markdown(_.escape(text)), 
        autoDownloadFontAwesome: false, 
        showIcons: ['table'], 
        hideIcons: ['side-by-side', 'fullscreen'], 
        spellChecker: false, 
        status: false });
    }
  }

  render() {
    const { i18n: { errMsg }, loading, path } = this.props;

    return (
      <Modal show onHide={ this.handleCancel } bsSize='large' backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>新建文档</Modal.Title>
        </Modal.Header>
        <Modal.Body style={ { height: '580px', overflow: 'auto' } }>
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
          <span className='ralign'>{ this.state.ecode !== 0 && !loading && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ loading ? 'loading' : 'hide' }/>
          <Checkbox 
            disabled={ loading } 
            checked={ this.state.isSendMsg } 
            onClick={ () => { this.setState({ isSendMsg: !this.state.isSendMsg }) } }
            style={ { display: 'inline-block', marginRight: '20px', marginLeft: '10px' } }>
            通知项目成员
          </Checkbox>
          <Button disabled={ loading || !this.state.name } onClick={ this.handleSubmit }>确定</Button>
          <Button bsStyle='link' disabled={ loading } onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
