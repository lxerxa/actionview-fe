import React, { PropTypes, Component } from 'react';
import { Modal, Button, FormGroup, ControlLabel, Radio, Form, Col } from 'react-bootstrap';
import Select from 'react-select';
import DateTime from 'react-datetime';
import { notify } from 'react-notify-toast';
import _ from 'lodash';

const moment = require('moment');
const loadimg = require('../../assets/images/loading.gif');

export default class ConfigSetModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0, mode: 'set', type: '', start_time: moment(props.day), end_time: moment(props.day) };
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    day: PropTypes.string.isRequired
  }

  async confirm() {
    const { close, update } = this.props;
    const ecode = await update(_.extend({}, { 
      mode: this.state.mode, 
      type: this.state.type, 
      start_time: moment(this.state.start_time).format('YYYYMMDD'), 
      end_time: moment(this.state.end_time).format('YYYYMMDD') 
    }));
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
          <Form horizontal style={ { marginTop: '10px' } }>
            <FormGroup>
              <Col sm={ 2 } componentClass={ ControlLabel }>
                时间段
              </Col>
              <Col sm={ 10 }>
                <div style={ { display: 'inline-block', width: '45%' } }>
                  <DateTime
                    locale='zh-cn'
                    mode='date'
                    closeOnSelect
                    dateFormat='YYYY/MM/DD'
                    timeFormat={ false }
                    value={ this.state.start_time }
                    onChange={ (newValue) => { this.setState({ start_time: newValue }) } }/>
                </div>
                <div style={ { display: 'inline-block', width: '7%', textAlign: 'center' } }>～</div>
                <div style={ { display: 'inline-block', width: '45%' } }>
                  <DateTime
                    locale='zh-cn'
                    mode='date'
                    closeOnSelect
                    dateFormat='YYYY/MM/DD'
                    timeFormat={ false }
                    value={ this.state.end_time }
                    onChange={ (newValue) => { this.setState({ end_time: newValue }) } }/>
                </div>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col sm={ 2 } componentClass={ ControlLabel }>
                操作 
              </Col>
              <Col sm={ 10 }>
                <div style={ { display: 'inline-block' } }>
                  <Radio 
                    inline
                    name='swap' 
                    onClick={ () => { this.setState({ mode : 'set' }) } }
                    checked={ this.state.mode === 'set' }> 
                    修改日历为 
                  </Radio>
                  <div style={ { width: '200px', margin: '5px 5px 10px 18px' } }>
                    <Select
                      simpleValue
                      clearable={ false }
                      disabled={ this.state.mode !== 'set' }
                      options={ [ { value: 'holiday', label: '假期' }, { value: 'workday', label: '工作日' } ] }
                      value={ this.state.type }
                      onChange={ (newValue) => { this.setState({ type: newValue }) } }
                      placeholder='选择类型'/>
                  </div>
                  <Radio 
                    inline
                    name='remove' 
                    onClick={ () => { this.setState({ mode : 'cancel' }) } }
                    checked={ this.state.mode === 'cancel' }> 
                    移除配置
                  </Radio>
                </div>
              </Col>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !loading && errMsg[this.state.ecode] }</span>
          <img src={ loadimg } className={ loading ? 'loading' : 'hide' }/>
          <Button 
            onClick={ this.confirm } 
            disabled={ loading || (this.state.mode === 'set' && !this.state.type) || !moment(this.state.start_time).isValid() || !moment(this.state.end_time).isValid() }>
            确定
          </Button>
          <Button bsStyle='link' disabled={ loading } onClick={ this.cancel }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
