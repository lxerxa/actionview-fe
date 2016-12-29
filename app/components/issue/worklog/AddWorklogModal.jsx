import React, { PropTypes, Component } from 'react';
import { Modal, Button, Form, FormGroup, Col, ControlLabel, FormControl } from 'react-bootstrap';
import { RadioGroup, Radio } from 'react-radio-group';
import DateTime from 'react-datetime';
import _ from 'lodash';
const moment = require('moment');

const img = require('../../../assets/images/loading.gif');

export default class AddWorklogModal extends Component {
  constructor(props) {
    super(props);
    const { data={} } = this.props;
    const errors = {};
    if (data.id) {
      errors.started_at = '必填';
      errors.spend = '必填';
      if (data.adjust_type == '3' && (!data.leave_estimate || _.trim(data.leave_estimate) == '')) {
        errors.leave_estimate = '必填';
      } else if (data.adjust_type == '4' && !data.cut) {
        errors.cut = '必填';
      }
    } else {
      errors.started_at = '必填';
      errors.spend = '必填';
    }

    this.state = { ecode: 0, errors, started_at: data.started_at || '', spend: data.spend || '', adjust_type: data.adjust_type || '1', comments: data.comments || '', touched: {} };
    
    this.changeStartedAt = this.changeStartedAt.bind(this);
    this.changeSpend = this.changeSpend.bind(this);
    this.changeLe = this.changeLe.bind(this);
    this.changeCut = this.changeCut.bind(this);
    this.changeType = this.changeType.bind(this);
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  static propTypes = {
    close: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired
  }

  async confirm() {
    const { close, edit, data } = this.props;

    let ecode = 0;
    if (data.id) {
      ecode = await edit();
    } else {
      ecode = await edit();
    }
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
    } else {
      this.setState({ ecode: ecode });
    }
  }

  ttTest(tt) {
    let newtt = _.trim(tt);
    const tts = newtt.split(' ');

    let flag = true;
    _.map(tts, (v) => {
      if (v) {
        if (!_.endsWith(v.toLowerCase(), 'w') && !_.endsWith(v.toLowerCase(), 'd') && !_.endsWith(v.toLowerCase(), 'h') && !_.endsWith(v.toLowerCase(), 'm')) {
          flag = false;
        }
        let time = v.substr(0, v.length - 1);
        if (time && isNaN(time)) {
          flag = false;
        }
      }
    });
    return flag;
  }

  changeStartedAt(newValue) {
    if (!newValue) {
      this.state.errors.started_at = '必填'
    } else {
      if (!moment(newValue).isValid()) {
        this.state.errors.started_at = '格式有误';
      } else {
        delete this.state.errors.started_at;
      }
    }
    this.state.touched.started_at = true;
    this.setState({ started_at: newValue, errors: this.state.errors, touched: this.state.touched });
  }

  changeSpend(e) {
    if (!e.target.value) {
      this.state.errors.spend = '必填'
    } else {
      if (!this.ttTest(e.target.value)) {
        this.state.errors.spend = '格式有误';
      } else {
        delete this.state.errors.spend;
      }
    }
    this.setState({ spend: e.target.value, errors: this.state.errors });
  }

  changeLe(e) {
    if (!e.target.value) {
      this.state.errors.leave_estimate = '必填'
    } else {
      if (!this.ttTest(e.target.value)) {
        this.state.errors.leave_estimate = '格式有误';
      } else {
        delete this.state.errors.leave_estimate;
      }
    }
    this.setState({ leave_estimate: e.target.value, errors: this.state.errors });
  }

  changeCut(e) {
    if (!e.target.value) {
      this.state.errors.cut = '必填'
    } else {
      if (!this.ttTest(e.target.value)) {
        this.state.errors.cut = '格式有误';
      } else {
        delete this.state.errors.cut;
      }
    }
    this.setState({ cut: e.target.value, errors: this.state.errors });
  }

  changeType(val) {
    this.setState({ adjust_type: val });
  }

  cancel() {
    const { close } = this.props;
    close();
  }

  render() {
    const { data, loading } = this.props;
    return (
      <Modal { ...this.props } onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ data.id ? '编辑工作日志' : '添加工作日志' }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup controlId='formControlsLabel' validationState={ this.state.touched.started_at && this.state.errors.started_at && 'error' }>
              <Col sm={ 3 } componentClass={ ControlLabel }>
                <span className='txt-impt'>*</span> 开始时间 
              </Col>
              <Col sm={ 6 }>
                <DateTime
                  type='text'
                  mode='date'
                  locale='zh-cn'
                  dateFormat={ 'YYYY/MM/DD' }
                  timeFormat={ 'HH:mm' }
                  value={ this.state.started_at }
                  onChange={ (newValue) => { this.changeStartedAt(newValue) } } />
              </Col>
              <Col sm={ 2 } componentClass={ ControlLabel } style={ { textAlign: 'left' } }>
                 { this.state.touched['started_at'] && (this.state.errors['started_at'] || '') }
              </Col>
            </FormGroup>
            <FormGroup controlId='formControlsLabel' validationState={ this.state.touched.spend && this.state.errors.spend && 'error' }>
              <Col sm={ 3 } componentClass={ ControlLabel }>
                <span className='txt-impt'>*</span> 耗费时间
              </Col>
              <Col sm={ 6 }>
                <FormControl
                  type='text'
                  value={ this.state.spend } 
                  onChange={ (e) => { this.changeSpend(e) } }
                  onBlur={ (e) => { this.state.touched.spend = true; this.setState({ touched: this.state.touched }); } }
                  placeholder={ '例如：3w 4d 12h 30m' } />
              </Col>
              <Col sm={ 2 } componentClass={ ControlLabel } style={ { textAlign: 'left' } }>
                 { this.state.touched['spend'] && (this.state.errors['spend'] || '') }
              </Col>
            </FormGroup>
            <FormGroup controlId='formControlsLabel'>
              <Col sm={ 3 } componentClass={ ControlLabel }>
                剩余时间
              </Col>
              <Col sm={ 9 }>
                <RadioGroup
                  style={ { marginTop: '6px' } }
                  selectedValue={ this.state.adjust_type }
                  onChange={ (val) => { this.changeType(val) } }
                  name='adjust_type'>
                  <ul className='list-unstyled clearfix' style={ { lineHeight: '40px' } }>
                    <li><Radio value='1'/> 自动调整</li>
                    <li><Radio value='2'/> 现有剩余预估时间不变</li>
                    <li>
                      <Radio value='3'/>
                      <span> 设置为 </span>
                      <FormControl 
                        type='text' 
                        value={ this.state.leave_estimate } 
                        disabled={ this.state.adjust_type != '3' }
                        placeholder={ '例如：3w 4d 12h 30m' } 
                        style={ { display: 'inline-block', width: '40%' } } 
                        onBlur={ (e) => { this.state.touched.leave_estimate = true; this.setState({ touched: this.state.touched }); } }
                        onChange={ (e) => { this.changeLe(e) } }/>
                    </li>
                    <li>
                      <Radio value='4'/>
                      <span> 缩减 </span>
                      <FormControl 
                        type='text' 
                        disabled={ this.state.adjust_type != '4' }
                        value={ this.state.cut } 
                        onBlur={ (e) => { this.state.touched.cut = true; this.setState({ touched: this.state.touched }); } }
                        onChange={ (e) => { this.changeCut(e) } }
                        placeholder={ '例如：3w 4d 12h 30m' } 
                        style={ { display: 'inline-block', width: '40%' } }/>
                    </li>
                  </ul>
                </RadioGroup>
              </Col>
            </FormGroup>
            <FormGroup controlId='formControlsLabel'>
              <Col sm={ 3 } componentClass={ ControlLabel }>
                备注
              </Col>
              <Col sm={ 8 }>
                <FormControl
                  componentClass='textarea'
                  style={ { height: '120px' } }
                  value={ this.state.comments } />
              </Col>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !loading && 'aaaa' }</span>
          <img src={ img } className={ loading ? 'loading' : 'hide' }/>
          <Button disabled={ this.state.oldContents === this.state.contents || loading } onClick={ this.confirm }>确定</Button>
          <Button bsStyle='link' disabled={ loading } onClick={ this.cancel }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
