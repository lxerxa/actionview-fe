import React, { Component, PropTypes } from 'react';
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
      start_direct: 'past', // current: 当前，past：过去，future：将来
      start_value: '',
      end_direct: 'future', // current: 当前，past：过去，future：将来
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
        const firstChar = sections[0].charAt(0);
        if (firstChar == '-') {
          start_direct = 'past';
          start_value = sections[0].substr(1);
        } else {
          start_direct = 'future';
          start_value = sections[0];
        }
      }

      if (sections[1]) {
        const firstChar = sections[1].charAt(0);
        if (firstChar == '-') {
          end_direct = 'past';
          end_value = sections[1].substr(1);
        } else {
          end_direct = 'future';
          end_value = sections[1];
        }
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
      start_direct, 
      start_value, 
      end_direct, 
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
      let tmp_start_time = '', tmp_end_time = '';
      if (start_direct && start_value) {
        if (start_direct == 'past') {
          tmp_start_time = '-' + start_value;
        } else {
          tmp_start_time = start_value;
        }
      }

      if (end_direct && end_value) {
        if (end_direct == 'past') {
          tmp_end_time = '-' + end_value;
        } else {
          tmp_end_time = end_value;
        }
      }

      return !tmp_start_time && !tmp_end_time ? '' : (tmp_start_time + '~' + tmp_end_time);
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

    const modeOptions = [
      { value: 'fixed', label: '固定时间段' }, 
      { value: 'current_duration', label: '当前时间段' },
      { value: 'past_duration', label: '过去时间段内' },
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
        <div style={ { width: '140px', display: 'inline-block', float: 'left', paddingRight: '10px' } }>
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
        { this.state.mode === 'past_duration' &&
        <div style={ { width: '140px', display: 'inline-block', float: 'left' } }>
          <Select
            options={ pastVariableDurations }
            disabled={ false }
            simpleValue
            searchable={ false }
            clearable={ true }
            value={ past_value || null }
            onChange={ (newValue) => { this.onChange({ past_value: newValue }); } }
            placeholder='请选择'/>
        </div> }
        { mode === 'variable_duration' &&
        <div style={ { float: 'left', marginTop: '9px', paddingRight: '3px' } }>
          距今
        </div> }
        { mode === 'variable_duration' &&
        <div style={ { width: '65px', display: 'inline-block', float: 'left', paddingRight: '5px' } }>
          <Select
            options={ directOptions }
            disabled={ false }
            simpleValue
            searchable={ false }
            clearable={ false }
            value={ start_direct || 'past' }
            onChange={ (newValue) => { this.setState({ start_direct: newValue, start_value: '' }) } }
            placeholder='-'/>
        </div> }
        { mode === 'variable_duration' &&
        <div style={ { width: '105px', display: 'inline-block', float: 'left' } }>
          <Select
            options={ variableDurations }
            disabled={ false }
            simpleValue
            searchable={ false }
            clearable={ true }
            value={ start_value || null }
            onChange={ (newValue) => { this.onChange({ start_value: newValue }); } }
            placeholder='请选择'/>
        </div> }
        { mode === 'fixed' &&
        <div style={ { width: '200px', display: 'inline-block', float: 'left' } }>
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
        <div style={ { float: 'left', width: '30px', marginTop: '8px', textAlign: 'center' } }>～</div> }

        { mode === 'variable_duration' &&
        <div style={ { float: 'left', marginTop: '9px', paddingRight: '3px' } }>
          距今
        </div> }
        { mode === 'variable_duration' &&
        <div style={ { width: '65px', display: 'inline-block', float: 'left', paddingRight: '5px' } }>
          <Select
            options={ directOptions }
            disabled={ false }
            simpleValue
            searchable={ false }
            clearable={ false }
            value={ end_direct || 'future' }
            onChange={ (newValue) => { this.setState({ end_direct: newValue, end_value: '' }); } }
            placeholder='-'/>
        </div> }
        { mode === 'variable_duration' &&
        <div style={ { width: '105px', display: 'inline-block', float: 'left' } }>
          <Select
            options={ variableDurations }
            disabled={ false }
            simpleValue
            searchable={ false }
            clearable={ true }
            value={ end_value || null }
            onChange={ (newValue) => { this.onChange({ end_value: newValue }); } }
            placeholder='请选择'/>
        </div> }
        { mode === 'fixed' &&  
        <div style={ { width: '200px', display: 'inline-block', float: 'left' } }>
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
