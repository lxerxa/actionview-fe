import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import { RadioGroup, Radio } from 'react-radio-group';
import DropzoneComponent from 'react-dropzone-component';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const img = require('../../assets/images/loading.gif');

const { API_BASENAME } = process.env;

export default class ImportModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0, fid: '', fname: '', pattern: '1' };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    imports: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired
  }

  async handleSubmit() {
    const { index, imports, close } = this.props;
    const ecode = await imports(_.pick(this.state, [ 'fid', 'pattern' ]));
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('导入完成。', 'success', 2000);
      index();
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

  success(file, res) {
    this.setState({ fid: res.data && res.data.fid || '', fname: res.data && res.data.fname || '', ecode: 0, emsg: '' });
    this.dropzone.removeFile(file);
  }

  render() {
    const { i18n: { errMsg }, loading } = this.props;

    const componentConfig = {
      showFiletypeIcon: true,
      postUrl: API_BASENAME + '/tmpfile'
    };
    const djsConfig = {
      addRemoveLinks: true
    };
    const eventHandlers = {
      init: dz => this.dropzone = dz,
      success: this.success.bind(this)
    }

    return (
      <Modal show onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>批量导入</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup>
            { this.state.fid ?
            <ControlLabel>File：{ this.state.fname }</ControlLabel>
            :
            <ControlLabel>选择导入Excel文件</ControlLabel> }
            <DropzoneComponent config={ componentConfig } eventHandlers={ eventHandlers } djsConfig={ djsConfig } />
          </FormGroup>
          <FormGroup>
            <ControlLabel>导入冲突时处理方式</ControlLabel>
            <RadioGroup
              disabled ={ loading }
              name='pattern'
              selectedValue={ this.state.pattern }
              onChange={ (newValue) => { this.setState({ pattern: newValue }) } }>
              <span><Radio value='1'/> 保持原有用户不变</span>
              <span style={ { marginLeft: '12px' } }><Radio value='2'/> 覆盖原有用户信息</span>
            </RadioGroup>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <a href='/template/import_user_tpl.xlsx' style={ { float: 'left', marginTop: '5px', marginLeft: '5px' } } download='import_user_tpl.xlsx'>模版下载</a>
          <span className='ralign'>{ this.state.ecode !== 0 && !loading && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ loading ? 'loading' : 'hide' }/>
          <Button disabled={ loading || !this.state.fid } onClick={ this.handleSubmit }>Submit</Button>
          <Button bsStyle='link' disabled={ loading } onClick={ this.handleCancel }>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
