import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup, Col, Form } from 'react-bootstrap';
import _ from 'lodash';
import { notify } from 'react-notify-toast';
import Cropper from 'react-cropper';

const no_avatar = require('../../../assets/images/no_avatar.png');
const img = require('../../../assets/images/loading.gif');

export default class AvatarEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0, src: '', cropResult: null };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    setAvatar: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired
  }

  onChange(e) {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.setState({ src: reader.result });
    };
    reader.readAsDataURL(files[0]);
  }

  async handleSubmit() {
    const { setAvatar, close } = this.props;
    const ecode = await setAvatar();
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('设置完成。', 'success', 2000);
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

  _crop() {
    // image in dataUrl
    console.log(this.refs.cropper.getCroppedCanvas().toDataURL());
  }

  render() {
    const { i18n: { errMsg }, loading } = this.props;

    return (
      <Modal { ...this.props } onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>设置头像</Modal.Title>
        </Modal.Header>
        <Modal.Body style={ { height: '400px', overflow: 'auto' } }>
          <div style={ { marginBottom: '15px' } }>
            <a className='upload-img'>
              选择头像
              <input type='file' onChange={ this.onChange.bind(this) }/>
            </a> 
          </div>
          <Form horizontal>
            <FormGroup controlId='formControlsText'>
              <Col sm={ 8 }>
                <div className='avatar-edit-container'>
                  <Cropper
                    ref='cropper'
                    style={ { height: 300, width: '100%' } }
                    aspectRatio={ 16 / 16 }
                    preview='.preview-img'
                    guides={ false }
                    src={ this.state.src } />
                  <img style={ { opacity: 0 } }/>
                </div>
              </Col>
              <Col sm={ 4 }>
                <div className='preview-img'>
                  <img src={ no_avatar } style={ { width: '120px' } }/>
                </div>
              </Col>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !loading && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ loading ? 'loading' : 'hide' }/>
          <Button onClick={ this._crop.bind(this) }>确定</Button>
          <Button bsStyle='link' disabled={ loading } onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
