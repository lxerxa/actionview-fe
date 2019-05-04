import React, { PropTypes, Component } from 'react';
import { Modal, Button, Form, FormGroup, Col, ControlLabel, FormControl } from 'react-bootstrap';
import { RadioGroup, Radio } from 'react-radio-group';
import DateTime from 'react-datetime';
import _ from 'lodash';
const moment = require('moment');
import { notify } from 'react-notify-toast';

const img = require('../../../assets/images/loading.gif');

export default class AddWorklogModal extends Component {
  constructor(props) {
    super(props);
    const { data={} } = this.props;
    const errors = {};
    if (data.id) {
      if (!data.started_at) {
        errors.started_at = '必填';
      }
      if (!data.spend) {
        errors.spend = '必填';
      }
      if (data.adjust_type == '3' && (!data.leave_estimate || _.trim(data.leave_estimate) == '')) {
        errors.leave_estimate = '必填';
      } else if (data.adjust_type == '4' && !data.cut) {
        errors.cut = '必填';
      }
    } else {
      // errors.started_at = '必填';
      errors.spend = '必填';
    }

    const values = {};
    const oldValues = {};
    oldValues['started_at'] = values['started_at'] = data.started_at ? moment.unix(data.started_at) : moment();
    oldValues['spend'] = values['spend'] = data.spend || '';
    oldValues['adjust_type'] = values['adjust_type'] = data.adjust_type || '1';
    oldValues['leave_estimate'] = values['leave_estimate'] = data.leave_estimate || '';
    oldValues['cut'] = values['cut'] = data.cut || '';
    oldValues['comments'] = values['comments'] = data.comments || '';

    this.state = { ecode: 0, errors, values, oldValues, touched: {} };
    
    this.changeStartedAt = this.changeStartedAt.bind(this);
    this.changeType = this.changeType.bind(this);
    this.changeTT = this.changeTT.bind(this);
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    issue: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired,
    add: PropTypes.func,
    edit: PropTypes.func,
    loading: PropTypes.bool.isRequired,
    data: PropTypes.object
  }

  async confirm() {
    const { issue, close, add, edit, data={} } = this.props;

    let ecode = 0;
    if (data.id) {
      const newValues = {};
      _.mapKeys(this.state.values, (val, key) => {
        if (key == 'started_at') {
          if (!val.isSame(this.state.oldValues[key])) {
            newValues[key] = this.state.values[key];
          }
        } else if (!_.isEqual(val, this.state.oldValues[key])) {
          newValues[key] = this.state.values[key];
        }
      });
      if (newValues.started_at) {
        newValues.started_at = parseInt(moment(this.state.values.started_at).format('X'));
      }
      if (newValues.leave_estimate || newValues.cut) {
        newValues.adjust_type = this.state.values.adjust_type;
      }
      ecode = await edit(issue.id, data.id, newValues);
      this.setState({ ecode });
      if (ecode === 0) {
        close();
        notify.show('日志已更新。', 'success', 2000);
      }
    } else {
      const newValues = _.clone(this.state.values);
      newValues.started_at = parseInt(moment(this.state.values.started_at).format('X'));
      ecode = await add(issue.id, newValues);
      this.setState({ ecode });
      if (ecode === 0) {
        close();
        notify.show('已添加日志。', 'success', 2000);
      }
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
        if ((time && isNaN(time)) || time < 0) {
          flag = false;
        }
      }
    });
    return flag;
  }

  changeTT(e, field) {
    if (!e.target.value) {
      this.state.errors[field] = '必填'
    } else {
      if (!this.ttTest(e.target.value)) {
        this.state.errors[field] = '格式有误';
      } else {
        delete this.state.errors[field];
      }
    }
    this.state.values[field] = e.target.value;
    this.setState({ values: this.state.values, errors: this.state.errors, touched: this.state.touched });
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
    this.state.values.started_at = newValue;
    this.setState({ values: this.state.values, errors: this.state.errors, touched: this.state.touched });
  }

  changeType(val) {
    this.state.values.adjust_type = val;

    this.state.values.leave_estimate = '';
    delete this.state.touched.leave_estimate;
    delete this.state.errors.leave_estimate;

    this.state.values.cut = '';
    delete this.state.touched.cut;
    delete this.state.errors.cut;

    if (val == '3') {
      this.state.errors.leave_estimate = '必填';
    } else if (val == '4') {
      this.state.errors.cut = '必填';
    }

    this.setState({ values: this.state.values, errors: this.state.errors, touched: this.state.touched });
  }

  cancel() {
    const { close } = this.props;
    close();
  }

  render() {
    const { i18n: { errMsg }, data={}, loading, issue } = this.props;
    const styles = { display: 'inline-block', width: '40%' };
    const err_styles = { display: 'inline-block', width: '40%', borderColor: '#a94442' };

    return (
      <Modal { ...this.props } onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ data.id ? '编辑工作日志' : ('添加工作日志' + (issue.no ? (' - ' + issue.no) : '')) }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal style={ { marginTop: '15px' } }>
            <FormGroup validationState={ this.state.touched.started_at && this.state.errors.started_at && 'error' }>
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
                  value={ this.state.values.started_at }
                  onChange={ (newValue) => { this.changeStartedAt(newValue) } } />
              </Col>
              <Col sm={ 2 } componentClass={ ControlLabel } style={ { textAlign: 'left' } }>
                 { this.state.touched.started_at && (this.state.errors.started_at || '') }
              </Col>
            </FormGroup>
            <FormGroup controlId='formControlsLabel' validationState={ this.state.touched.spend && this.state.errors.spend && 'error' }>
              <Col sm={ 3 } componentClass={ ControlLabel }>
                <span className='txt-impt'>*</span> 耗费时间
              </Col>
              <Col sm={ 5 }>
                <FormControl
                  type='text'
                  value={ this.state.values.spend } 
                  onChange={ (e) => { this.changeTT(e, 'spend') } }
                  onBlur={ (e) => { this.state.touched.spend = true; this.setState({ touched: this.state.touched }); } }
                  placeholder={ '例如：3w 4d 5h' } />
              </Col>
              <Col sm={ 2 } componentClass={ ControlLabel } style={ { textAlign: 'left' } }>
                 { this.state.touched.spend && (this.state.errors.spend || '') }
              </Col>
            </FormGroup>
            <FormGroup controlId='formControlsLabel'>
              <Col sm={ 3 } componentClass={ ControlLabel }>
                剩余时间
              </Col>
              <Col sm={ 9 }>
                <RadioGroup
                  style={ { marginTop: '6px' } }
                  selectedValue={ this.state.values.adjust_type }
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
                        value={ this.state.values.leave_estimate } 
                        disabled={ this.state.values.adjust_type != '3' }
                        placeholder={ '例如：3w 4d 5h' } 
                        style={ this.state.touched.leave_estimate && this.state.errors.leave_estimate ? err_styles : styles } 
                        onBlur={ (e) => { this.state.touched.leave_estimate = true; this.setState({ touched: this.state.touched }); } }
                        onChange={ (e) => { this.changeTT(e, 'leave_estimate') } }/>
                      <span style={ { marginLeft: '10px', color: '#a94442', fontWeight: 'bold' } }>{ this.state.touched.leave_estimate && (this.state.errors.leave_estimate || '') }</span>
                    </li>
                    <li>
                      <Radio value='4'/>
                      <span> 缩减 </span>
                      <FormControl 
                        type='text' 
                        disabled={ this.state.values.adjust_type != '4' }
                        value={ this.state.values.cut } 
                        onBlur={ (e) => { this.state.touched.cut = true; this.setState({ touched: this.state.touched }); } }
                        onChange={ (e) => { this.changeTT(e, 'cut') } }
                        placeholder={ '例如：3w 4d 5h' } 
                        style={ { display: 'inline-block', width: '40%' } }/>
                      <span style={ { marginLeft: '10px', color: '#a94442', fontWeight: 'bold' } }>{ this.state.touched.cut && (this.state.errors.cut || '') }</span>
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
                  value={ this.state.values['comments'] }
                  onChange={ (e) => { this.state.values.comments = e.target.value; this.setState({ values: this.state.values }) } } />
              </Col>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !loading && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ loading ? 'loading' : 'hide' }/>
          <Button disabled={ _.isEqual(this.state.oldValues, this.state.values) || loading || !_.isEmpty(this.state.errors) } onClick={ this.confirm }>确定</Button>
          <Button bsStyle='link' disabled={ loading } onClick={ this.cancel }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
