import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup, Table } from 'react-bootstrap';
import { RadioGroup, Radio } from 'react-radio-group';
import DropzoneComponent from 'react-dropzone-component';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const img = require('../../assets/images/loading.gif');

export default class ImportModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0, emsg: '', fid: '', fanme: '' };
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
    const error = await imports(_.pick(this.state, [ 'fid' ]));
    if (error.ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('导入完成。', 'success', 2000);
      index();
    } else {
      this.setState({ ecode: error.ecode, emsg: error.emsg });
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
    this.setState({ fid: res.data && res.data.fid || '' });
    this.dropzone.removeFile(file);
  }

  removedfile() {
    this.setState({ fid: '', fname: '' });
  }

  render() {
    const { loading } = this.props;
    const { ecode, emsg } = this.state;

    const componentConfig = {
      showFiletypeIcon: true,
      postUrl: '/api/tmpfile'
    };
    const djsConfig = {
      addRemoveLinks: true,
      maxFilesize: 50
    };
    const eventHandlers = {
      init: dz => this.dropzone = dz,
      success: this.success.bind(this),
      removedfile: this.removedfile.bind(this)
    }

    return (
      <Modal show onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>批量导入</Modal.Title>
        </Modal.Header>
        <Modal.Body style={ { maxHeight: '580px', overflow: 'auto' } }>
          <FormGroup>
            { this.state.fid ?
            <ControlLabel>{ this.state.fname }</ControlLabel>
            :
            <ControlLabel>选择导入Excel文件<a href='/template/import_issue_tpl.xlsx' style={ { fontWeight: 200, marginLeft: '15px' } } download='import_issue_tpl.xlsx'>模版下载</a></ControlLabel> }
            <DropzoneComponent config={ componentConfig } eventHandlers={ eventHandlers } djsConfig={ djsConfig } />
          </FormGroup>
          { !loading && ecode !== 0 && 
          <span style={ { color: 'red', fontWeight: 600 } }>
            { _.isObject(emsg) ? '文件内容解析错误：' : emsg }
          </span> }
          { !loading && ecode !== 0 && _.isObject(emsg) && 
          <Table condensed hover responsive>
            <thead>
              <tr>
                <th>行（主题）</th>
                <th>错误信息</th>
              </tr>
            </thead>
            <tbody>
              { _.map(emsg, (msg, title) => {
                return (
                  <tr>
                    <td key={ title }>{ title }</td>
                    <td>
                      <ul style={ { marginBottom: '0px', paddingLeft: '0px', listStyle: 'none' } }>
                        { _.map(msg, (v, k) => {
                          return (<li key={ k }>{ v }</li>);
                        }) }
                      </ul>
                    </td>
                  </tr> );
              }) }
            </tbody>
          </Table> }
        </Modal.Body>
        <Modal.Footer>
          <img src={ img } className={ loading ? 'loading' : 'hide' }/>
          <Button disabled={ loading || !this.state.fid } onClick={ this.handleSubmit }>确定</Button>
          <Button bsStyle='link' disabled={ loading } onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
