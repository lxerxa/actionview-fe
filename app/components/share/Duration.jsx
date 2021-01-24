import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import DateTime from 'react-datetime';
import _ from 'lodash';

const moment = require('moment');

export default class Duration extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      options: !_.isEmpty(props.options) ? props.options : [ 'fixed', 'current_variable', 'inside_variable', 'outside_variable' ],
      mode: 'fixed', 
      start_time: '', 
      end_time: '', 
      current_variable: '', 
      inside_variable: '', 
      outside_variable: '' 
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

    if (nextProps.value == this.props.value) {
      return;
    }

    let mode = 'fixed', start_time = '', end_time = '', current_variable = '', inside_variable = '', outside_variable = '';
    const suffix_list = [ 'w', 'm', 'y' ];

    const duration = nextProps.value || '';
    if (!duration || duration.indexOf('~') !== -1) {
      mode = 'fixed'; 
      const sections = duration.split('~');
      start_time = sections[0] ? moment(sections[0]) : '';
      end_time = sections[1] ? moment(sections[1]) : '';
    } else if ([ '0d', '0w', '0m', '0y' ].indexOf(duration) !== -1) {
      mode = 'current_variable';
      current_variable = duration;
    } else if (suffix_list.indexOf(duration.substr(duration.length - 1)) !== -1) {
      if (_.startsWith(duration, '-')) {
        mode = 'outside_variable';
        outside_variable = duration;
      } else {
        mode = 'inside_variable';
        inside_variable = duration;
      }
    }
    this.setState({ mode, start_time, end_time, current_variable, inside_variable, outside_variable });
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
    const { start_time, end_time, mode, current_variable, inside_variable, outside_variable } = this.state;

    if (mode === 'fixed') {
      if (start_time || end_time) {
        return (start_time ? moment(start_time).format('YYYY/MM/DD') : '') + '~' + (end_time ? moment(end_time).format('YYYY/MM/DD') : '');
      } else {
        return '';
      }
    } else if (mode === 'current_variable') {
      return current_variable;
    } else if (mode === 'outside_variable') {
      return outside_variable;
    } else if (mode === 'inside_variable') {
      return inside_variable;
    } else {
      return '';
    }
  }

  render() {

    const modeOptions = [
      { value: 'fixed', label: '固定时间段' }, 
      { value: 'current_variable', label: '当前时间段' }, 
      { value: 'inside_variable', label: '时间段之内' }, 
      { value: 'outside_variable', label: '时间段之外' }
    ];

    const variable_durations = [
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

    const current_variable_durations = [
      { value: '0d', label: '当天' },
      { value: '0w', label: '当前周' },
      { value: '0m', label: '当月' },
      { value: '0y', label: '当前年' }
    ];

    return (
      <div style={ { display: 'inline' } } onClick={ (e) => { e.stopPropagation(); } }>
        { this.state.options.length > 1 &&
        <div style={ { width: '26%', display: 'inline-block', float: 'left', paddingRight: '5px' } }>
          <Select
            options={ _.filter(modeOptions, (v) => this.state.options.indexOf(v.value) !== -1) }
            disabled={ false }
            simpleValue
            searchable={ false }
            clearable={ false }
            value={ this.state.mode }
            onChange={ (newValue) => { this.setState({ mode: newValue }) } }
            placeholder='请选择'/>
        </div> }
        { this.state.mode === 'current_variable' &&
        <div style={ { width: '40%', display: 'inline-block', float: 'left' } }>
          <Select
            options={ current_variable_durations }
            disabled={ false }
            simpleValue
            searchable={ false }
            clearable={ true }
            value={ this.state.current_variable || null }
            onChange={ (newValue) => { this.onChange({ current_variable: newValue }); } }
            placeholder='请选择'/>
        </div> }
        { this.state.mode === 'outside_variable' &&
        <div style={ { width: '40%', display: 'inline-block', float: 'left' } }>
          <Select
            options={ _.map(variable_durations, (v) => { return { value: '-' + v.value, label: v.label } }) }
            disabled={ false }
            simpleValue
            searchable={ false }
            clearable={ true }
            value={ this.state.outside_variable || null }
            onChange={ (newValue) => { this.onChange({ outside_variable: newValue }); } }
            placeholder='请选择'/>
        </div> }
        { this.state.mode === 'outside_variable' && <span style={ { float: 'left', marginTop: '8px', marginLeft: '2px' } }>之外</span> }
        { this.state.mode === 'inside_variable' &&
        <div style={ { width: '40%', display: 'inline-block', float: 'left' } }>
          <Select
            options={ variable_durations }
            disabled={ false }
            simpleValue
            searchable={ false }
            clearable={ true }
            value={ this.state.inside_variable || null }
            onChange={ (newValue) => { this.onChange({ inside_variable: newValue }); } }
            placeholder='请选择'/>
        </div> }
        { this.state.mode === 'inside_variable' && <span style={ { float: 'left', marginTop: '8px', marginLeft: '2px' } }>之内</span> }
        { this.state.mode === 'fixed' &&
        <div style={ { width: '34%', display: 'inline-block', float: 'left' } }>
          <DateTime
            mode='date'
            locale='zh-cn'
            dateFormat={ 'YYYY/MM/DD' }
            timeFormat={ false }
            closeOnSelect={ true }
            inputProps={ { placeholder: '请选择' } }
            value={ this.state.start_time }
            onChange={ (newValue) => { this.onChange({ start_time: newValue }); } }/>
        </div> }
        { this.state.mode === 'fixed' && <div style={ { float: 'left', width: '6%', marginTop: '8px', textAlign: 'center' } }>～</div> }
        { this.state.mode === 'fixed' &&  
        <div style={ { width: '34%', display: 'inline-block', float: 'right' } }>
          <DateTime
            mode='date'
            locale='zh-cn'
            dateFormat={ 'YYYY/MM/DD' }
            timeFormat={ false }
            closeOnSelect={ true }
            input={ true }
            inputProps={ { placeholder: '请选择' } }
            value={ this.state.end_time }
            onChange={ (newValue) => { this.onChange({ end_time: newValue }); } }/>
        </div> }
      </div>
    )
  }
}
