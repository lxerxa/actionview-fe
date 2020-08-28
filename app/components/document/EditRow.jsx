import React, { PropTypes, Component } from 'react';
import { Modal, FormControl, Button } from 'react-bootstrap';
import { notify } from 'react-notify-toast';
import _ from 'lodash';

const $ = require('$');
const img = require('../../assets/images/loading.gif');

export default class EditRow extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '', ext: '' };
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    mode: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    fileIconCss: PropTypes.string,
    cancel: PropTypes.func.isRequired,
    createFolder: PropTypes.func,
    edit: PropTypes.func,
    data: PropTypes.object.isRequired,
    collection: PropTypes.array.isRequired
  }

  async confirm() {
    const { i18n: { errMsg }, mode, createFolder, edit, data, collection, cancel } = this.props;

    const reg = /^[^@\/\'\\\"#$%&\^\*]+$/;
    if (!reg.test(this.state.name)) {
      notify.show('名称中有特殊字符。', 'error', 2000);
      $('#input_nm').select();
      return;
    }

    let repeatChk = false;
    if (mode === 'createFolder' || mode === 'editFolder') {
      repeatChk = _.findIndex(_.filter(collection, { d: 1 }), { name: this.state.name }) !== -1;
    } else {
      repeatChk = _.findIndex(_.reject(collection, { d: 1 }), { name: this.state.ext ? (this.state.name + '.' + this.state.ext) : this.state.name }) !== -1;
    }
    if (repeatChk) {
      notify.show('名称重复。', 'error', 2000);
      $('#input_nm').select();
      return;
    }

    let ecode = 0;
    if (mode === 'createFolder') {
      ecode = await createFolder({ name: this.state.name });
      if (ecode === 0) {
        notify.show('创建完成。', 'success', 2000);
        cancel();
      } else {
        notify.show(errMsg[ecode] + '，Creation failed', 'error', 2000);
        $('#input_nm').select();
      }
    } else {
      ecode = await edit(data.id, { name: this.state.ext ? (this.state.name + '.' + this.state.ext) : this.state.name })
      if (ecode === 0) {
        notify.show('编辑完成。', 'success', 2000);
        cancel();
      } else {
        notify.show(errMsg[ecode] + '，更新失败。', 'error', 2000);
        $('#input_nm').select();
      }
    }
  }

  cancel() {
    const { cancel } = this.props;
    cancel();
  }

  componentWillMount() {
    const { data, mode } = this.props;

    let name = data.name || '';
    if (mode == 'editFile') {
      const lastInd = name.lastIndexOf('.');
      this.state.oldname = this.state.name = name.substring(0, lastInd);
      this.state.ext = name.substring(lastInd + 1);
    } else {
      this.state.oldname = this.state.name = name;
    }
  }

  componentDidMount() {
    $('#input_nm').select();
  }

  render() {
    const { data, mode, fileIconCss, loading } = this.props;

    return (
      <div>
        { (mode === 'createFolder' || mode === 'editFolder') &&
        <span style={ { marginRight: '5px', color: '#FFD300' } }><i className='fa fa-folder'></i></span> }
        { mode === 'editFile' && 
        <span style={ { marginRight: '5px', color: '#777' } }><i className={ fileIconCss }></i></span> }
        <FormControl 
          type='text' 
          id='input_nm' 
          disabled={ loading }
          value={ this.state.name } 
          onKeyDown={ (e) => { if (e.keyCode == '13' && !(this.state.name === this.state.oldname || !this.state.name)) { this.confirm(); } } }
          onChange={ (e) => { this.setState({ name: _.trim(e.target.value) }) } }
          style={ { height: '30px', width: '250px', display: 'inline-block' } }/>
        { !loading &&
        <Button disabled={ this.state.name === this.state.oldname || !this.state.name } style={ { marginLeft: '10px', padding: '4px 10px' } } onClick={ this.confirm }>Submit</Button> }
        { !loading &&
        <Button style={ { padding: '4px 10px' } } bsStyle='link' onClick={ () => { this.cancel() } }>Cancel</Button> }
        <img src={ img } className={ loading ? 'loading' : 'hide' }/>
      </div>
    );
  }
}
