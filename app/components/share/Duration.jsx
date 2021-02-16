import React, { Component, PropTypes } from 'react';
import { FormControl } from 'react-bootstrap';
import Select from 'react-select';
import DateTime from 'react-datetime';
import _ from 'lodash';

const moment = require('moment');

export default class Duration extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      options: !_.isEmpty(props.options) ? props.options : [ 'fixed', 'current_duration', 'past_duration', 'variable_duration' ],
      mode: 'fixed',
      start_time: '', 
      end_time: '', 
      start_value: '',
      end_value: '' 
    };
    this.getValue = this.getValue.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  static propTypes = {
    options: PropTypes.array,
    onChange: PropTypes.func,
    value: PropTypes.string
  }

  componentWillReceiveProps(nextProps) {

    if (_.isEqual(nextProps.value, this.props.value)) {
      return;
    }

    let mode = this.state.mode, start_time = '', end_time = '', past_value = '', current_value = '', start_direct = this.state.start_direct, start_value = '', end_direct = this.state.end_direct, end_value = '';

    const suffix_list = [ 'd', 'w', 'm', 'y' ];

    const duration = nextProps.value || '';
    if (!duration) {
      return;
    }

    const sections = duration.split('~');

    let unit = '';
    if (sections[0]) {
      unit = sections[0].charAt(sections[0].length - 1);
    } else if (sections[1]) {
      unit = sections[1].charAt(sections[1].length - 1);
    }

    if (suffix_list.indexOf(unit) !== -1) {
      if (sections.length > 1) {
        mode = 'variable_duration';
      } else {
        mode = 'current_duration';
      }
    } else {
      mode = 'fixed';
    }

    if (mode == 'fixed') {
      start_time = sections[0] || '';
      end_time = sections[1] || '';
    } else if (mode == 'variable_duration') {
      if (sections[0]) {
        start_value = parseInt(sections[0]);
      }

      if (sections[1]) {
        end_value = parseInt(sections[1]);
      }
    } else {
      current_value = sections[0]; 
    }

    this.setState({ mode, start_time, end_time, current_value, start_direct, start_value, end_direct, end_value });
  }

  async onChange(data) {
    const { onChange } = this.props;
    await this.setState(data);
    if (this.state.mode === 'fixed' && ((this.state.start_time && !moment(this.state.start_time).isValid()) || (this.state.end_time && !moment(this.state.end_time).isValid()))) {
      return;
    }
    onChange(this.getValue());
  }

  getValue() {
    const { 
      mode, 
      start_time, 
      end_time, 
      current_value,
      past_value,
      start_value, 
      end_value 
    } = this.state;

    if (mode === 'fixed') {
      if (start_time || end_time) {
        return (start_time ? moment(start_time).format('YYYY/MM/DD') : '') + '~' + (end_time ? moment(end_time).format('YYYY/MM/DD') : '');
      } else {
        return '';
      }
    } else if (mode === 'current_duration') {
      return current_value;
    } else if (mode === 'past_duration') {
      return past_value + '~';
    } else if (mode === 'variable_duration') {
      let tmp_start_value = '', tmp_end_value = '';
      if (start_value || start_value === 0) {
        tmp_start_value = start_value + 'd';
      }
      if (end_value || end_value === 0) {
        tmp_end_value = end_value + 'd';
      }
      return !tmp_start_value && !tmp_end_value ? '' : (tmp_start_value + '~' + tmp_end_value);
    } else {
      return '';
    }
  }

  render() {

    const { 
      options,
      mode, 
      start_time, 
      end_time, 
      current_value,
      past_value,
      start_direct, 
      start_value, 
      end_direct, 
      end_value 
    } = this.state;

    const { value, onChange } = this.props;

    const modeOptions = [
      { value: 'fixed', label: '固定时间段' }, 
      { value: 'current_duration', label: '当前时间段' },
      { value: 'variable_duration', label: '动态时间段' }
    ];

    const currentDurations = [
      { value: '0d', label: '当天' },
      { value: '0w', label: '当前周' },
      { value: '0m', label: '当月' },
      { value: '0y', label: '当前年' }
    ];

    const directOptions = [
      { value: 'past', label: '前' },
      { value: 'future', label: '后' }
    ];

    const variableDurations = [
      { value: '0d', label: '当天' },
      { value: '1d', label: '1天' },
      { value: '2d', label: '2天' },
      { value: '3d', label: '3天' },
      { value: '4d', label: '4天' },
      { value: '5d', label: '5天' },
      { value: '6d', label: '6天' },
      { value: '1w', label: '1周' },
      { value: '2w', label: '2周' },
      { value: '3w', label: '3周' },
      { value: '1m', label: '1个月' },
      { value: '2m', label: '2个月' },
      { value: '3m', label: '3个月' },
      { value: '4m', label: '4个月' },
      { value: '5m', label: '5个月' },
      { value: '6m', label: '6个月' },
      { value: '7m', label: '7个月' },
      { value: '8m', label: '8个月' },
      { value: '9m', label: '9个月' },
      { value: '10m', label: '10个月' },
      { value: '11m', label: '11个月' },
      { value: '1y', label: '1年' },
      { value: '2y', label: '2年' }
    ];

    const pastVariableDurations = [
      { value: '1w', label: '1周' },
      { value: '2w', label: '2周' },
      { value: '3w', label: '3周' },
      { value: '1m', label: '1个月' },
      { value: '2m', label: '2个月' },
      { value: '3m', label: '3个月' },
      { value: '4m', label: '4个月' },
      { value: '5m', label: '5个月' },
      { value: '6m', label: '6个月' },
      { value: '7m', label: '7个月' },
      { value: '8m', label: '8个月' },
      { value: '9m', label: '9个月' },
      { value: '10m', label: '10个月' },
      { value: '11m', label: '11个月' },
      { value: '1y', label: '1年' },
      { value: '2y', label: '2年' }
    ];

    const currentVariableDurations = [
      { value: 'd', label: '天' },
      { value: 'w', label: '周' },
      { value: 'm', label: '月' },
      { value: 'y', label: '年' }
    ];

    return (
      <div style={ { display: 'inline' } } onClick={ (e) => { e.stopPropagation(); } }>
        { options.length > 1 &&
        <div style={ { width: '120px', display: 'inline-block', float: 'left', paddingRight: '10px' } }>
          <Select
            options={ _.filter(modeOptions, (v) => this.state.options.indexOf(v.value) !== -1) }
            disabled={ false }
            simpleValue
            searchable={ false }
            clearable={ false }
            value={ mode }
            onChange={ (newValue) => { this.setState({ mode: newValue }) } }
            placeholder='请选择'/>
        </div> }
        { this.state.mode === 'current_duration' &&
        <div style={ { width: '140px', display: 'inline-block', float: 'left' } }>
          <Select
            options={ currentDurations }
            disabled={ false }
            simpleValue
            searchable={ false }
            clearable={ true }
            value={ current_value || null }
            onChange={ (newValue) => { this.onChange({ current_value: newValue }); } }
            placeholder='请选择'/>
        </div> }
        { mode === 'variable_duration' &&
        <div style={ { float: 'left', marginTop: '9px', paddingRight: '5px' } }>
          距今
        </div> }
        { mode === 'variable_duration' &&
        <div style={ { width: '20%', display: 'inline-block', float: 'left' } }>
          <FormControl
            type='number'
            value={ this.state.start_value }
            placeholder='请输入'
            onBlur={ () => { const curValue = this.getValue(); if (value != curValue) { onChange(curValue) } } }
            onChange={ (e) => { this.setState({ start_value: parseInt(e.target.value) }); } } />
        </div> }
        { mode === 'variable_duration' &&
        <div style={ { float: 'left', marginTop: '9px', paddingLeft: '3px' } }>
          天
        </div> }
        { mode === 'fixed' &&
        <div style={ { width: '34%', display: 'inline-block', float: 'left' } }>
          <DateTime
            mode='date'
            locale='zh-cn'
            dateFormat={ 'YYYY/MM/DD' }
            timeFormat={ false }
            closeOnSelect={ true }
            inputProps={ { placeholder: '请选择' } }
            value={ start_time }
            onChange={ (newValue) => { this.onChange({ start_time: newValue }); } }/>
        </div> }

        { (mode === 'variable_duration' || mode === 'fixed') &&
        <div style={ { float: 'left', width: '20px', marginTop: '8px', textAlign: 'center' } }>～</div> }

        { mode === 'variable_duration' &&
        <div style={ { float: 'left', marginTop: '9px', paddingRight: '5px' } }>
          距今
        </div> }
        { mode === 'variable_duration' &&
        <div style={ { width: '20%', display: 'inline-block', float: 'left' } }>
          <FormControl
            type='number'
            value={ this.state.end_value }
            placeholder='请输入'
            onBlur={ () => { const curValue = this.getValue(); if (value != curValue) { onChange(curValue) } } }
            onChange={ (e) => { this.setState({ end_value: parseInt(e.target.value) }); } } />
        </div> }
        { mode === 'variable_duration' &&
        <div style={ { float: 'left', marginTop: '9px', paddingLeft: '3px' } }>
          天
        </div> }
        { mode === 'fixed' &&  
        <div style={ { width: '34%', display: 'inline-block', float: 'left' } }>
          <DateTime
            mode='date'
            locale='zh-cn'
            dateFormat={ 'YYYY/MM/DD' }
            timeFormat={ false }
            closeOnSelect={ true }
            input={ true }
            inputProps={ { placeholder: '请选择' } }
            value={ end_time }
            onChange={ (newValue) => { this.onChange({ end_time: newValue }); } }/>
        </div> }
      </div>
    )
  }
}
