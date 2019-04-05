import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import DateTime from 'react-datetime';
import _ from 'lodash';

const moment = require('moment');

export default class Duration extends Component {
  constructor(props) {
    super(props);
    this.state = { mode: 'fix_duration', start_time: '', end_time: '', inside_variable_duration: '', outside_variable_duration: '' };
    this.getValue = this.getValue.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string
  }

  componentWillReceiveProps(nextProps) {

    let mode = 'fix_duration', start_time = '', end_time = '', inside_variable_duration = '', outside_variable_duration = '';
    const suffix_list = [ 'w', 'm', 'y' ];

    const duration = nextProps.value || '';
    if (!duration || duration.indexOf('~') !== -1) {
      mode = 'fix_duration'; 
      const sections = duration.split('~');
      start_time = sections[0] ? moment(sections[0]) : '';
      end_time = sections[1] ? moment(sections[1]) : '';
    } else if (suffix_list.indexOf(duration.substr(duration.length - 1)) !== -1) {
      if (_.startsWith(duration, '-')) {
        mode = 'outside_variable_duration';
        outside_variable_duration = duration;
      } else {
        mode = 'inside_variable_duration';
        inside_variable_duration = duration;
      }
    }
    this.setState({ mode, start_time, end_time, inside_variable_duration, outside_variable_duration });
  }

  async onChange(data) {
    const { onChange } = this.props;
    await this.setState(data);
    if (this.state.mode === 'fix_duration' && ((this.state.start_time && !moment(this.state.start_time).isValid()) || (this.state.end_time && !moment(this.state.end_time).isValid()))) {
      return;
    }
    onChange(this.getValue());
  }

  getValue() {
    const { start_time, end_time, mode, inside_variable_duration, outside_variable_duration } = this.state;

    if (mode === 'fix_duration') {
      if (start_time || end_time) {
        return (start_time ? moment(start_time).format('YYYY/MM/DD') : '') + '~' + (end_time ? moment(end_time).format('YYYY/MM/DD') : '');
      } else {
        return '';
      }
    } else if (mode === 'outside_variable_duration') {
      return outside_variable_duration;
    } else if (mode === 'inside_variable_duration') {
      return inside_variable_duration;
    } else {
      return '';
    }
  }

  render() {

    const modeOptions = [
     { value: 'fix_duration', label: '固定时间' }, 
     { value: 'inside_variable_duration', label: '时间段之内' }, 
     { value: 'outside_variable_duration', label: '时间段之外' }
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

    return (
      <div style={ { display: 'inline' } }>
        <div style={ { width: '25%', display: 'inline-block', float: 'left', marginRight: '5px' } }>
          <Select
            options={ modeOptions }
            disabled={ false }
            simpleValue
            searchable={ false }
            clearable={ false }
            value={ this.state.mode }
            onChange={ (newValue) => { this.setState({ mode: newValue }) } }
            placeholder='请选择'/>
        </div>
        { this.state.mode === 'outside_variable_duration' &&
        <div style={ { width: '40%', display: 'inline-block', float: 'left' } }>
          <Select
            options={ _.map(variable_durations, (v) => { return { value: '-' + v.value, label: v.label } }) }
            disabled={ false }
            simpleValue
            searchable={ false }
            clearable={ true }
            value={ this.state.outside_variable_duration || null }
            onChange={ (newValue) => { this.onChange({ outside_variable_duration: newValue }); } }
            placeholder='请选择'/>
        </div> }
        { this.state.mode === 'outside_variable_duration' && <span style={ { float: 'left', marginTop: '8px', marginLeft: '2px' } }>之外</span> }
        { this.state.mode === 'inside_variable_duration' &&
        <div style={ { width: '40%', display: 'inline-block', float: 'left' } }>
          <Select
            options={ variable_durations }
            disabled={ false }
            simpleValue
            searchable={ false }
            clearable={ true }
            value={ this.state.inside_variable_duration || null }
            onChange={ (newValue) => { this.onChange({ inside_variable_duration: newValue }); } }
            placeholder='请选择'/>
        </div> }
        { this.state.mode === 'inside_variable_duration' && <span style={ { float: 'left', marginTop: '8px', marginLeft: '2px' } }>之内</span> }
        { this.state.mode === 'fix_duration' &&
        <div style={ { width: '33%', display: 'inline-block', float: 'left' } }>
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
        { this.state.mode === 'fix_duration' && <div style={ { float: 'left', width: '5%', marginTop: '8px', textAlign: 'center' } }>～</div> }
        { this.state.mode === 'fix_duration' &&  
        <div style={ { width: '33%', display: 'inline-block', float: 'left' } }>
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
