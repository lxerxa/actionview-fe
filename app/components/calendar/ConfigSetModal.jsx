import React, { PropTypes, Component } from 'react';
import { Modal, Button, FormGroup, Radio } from 'react-bootstrap';
import Select from 'react-select';
import { notify } from 'react-notify-toast';
import _ from 'lodash';

const loadimg = require('../../assets/images/loading.gif');

export default class ConfigSetModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0, operate_flg: '0', type: '' };
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired,
    set: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    day: PropTypes.string.isRequired
  }

  async confirm() {
    const { close, set, year } = this.props;
    const ecode = await set(_.extend({}, { operate_flg: this.state.operate_flg, type: this.state.type }));
    if (ecode === 0) {
      close();
      notify.show('配置完成。', 'success', 2000);
    }
    this.setState({ ecode: ecode });
  }

  cancel() {
    const { close, loading } = this.props;
    if (loading) {
      return;
    }
    close();
  }

  render() {
    const { i18n: { errMsg }, day, loading } = this.props;

    return (
      <Modal show onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>配置日历</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={ { margin: '20px 10px 10px 10px' } }>
            <div style={ { display: 'inline-block', verticalAlign: 'top', fontWeight: 600 } }>配置操作</div>
            <div style={ { display: 'inline-block', marginLeft: '20px' } }>
              <FormGroup>
                <Radio 
                  inline
                  name='swap' 
                  onClick={ () => { this.setState({ operate_flg : '1' }) } }
                  checked={ this.state.operate_flg === '1' }> 
                  修改日历为 
                </Radio>
                <div style={ { width: '300px', margin: '5px 5px 10px 18px' } }>
                  <Select
                    simpleValue
                    clearable={ false }
                    disabled={ this.state.operate_flg !== '1' }
                    options={ [ { value: 'holiday', label: '假期' }, { value: 'workday', label: '工作日' } ] }
                    value={ this.state.type }
                    onChange={ (newValue) => { this.setState({ type: newValue }) } }
                    placeholder='选择类型'/>
                </div>
                <Radio 
                  inline
                  name='remove' 
                  onClick={ () => { this.setState({ operate_flg : '2' }) } }
                  checked={ this.state.operate_flg === '2' }> 
                  移除配置
                </Radio>
              </FormGroup>
            </div>
          </div> }
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !loading && errMsg[this.state.ecode] }</span>
          <img src={ loadimg } className={ loading ? 'loading' : 'hide' }/>
          <Button 
            onClick={ this.confirm } 
            disabled={ loading || (this.state.operate_flg === '1' && !this.state.type) }>
            确定
          </Button>
          <Button bsStyle='link' disabled={ loading } onClick={ this.cancel }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
