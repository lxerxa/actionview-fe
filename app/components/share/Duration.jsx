import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import DateTime from 'react-datetime';
import _ from 'lodash';

const moment = require('moment');

export default class Duration extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      mode: props.mode || 'fixed', 
      isModeChanged: props.mode ? false : true, 
      start_time: '', 
      end_time: '', 
      inside_variable: '', 
      outside_variable: '' };
    this.getValue = this.getValue.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  static propTypes = {
    mode: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string
  }

  componentWillReceiveProps(nextProps) {

    let mode = 'fixed', start_time = '', end_time = '', inside_variable = '', outside_variable = '';
    const suffix_list = [ 'w', 'm', 'y' ];

    const duration = nextProps.value || '';
    if (!duration || duration.indexOf('~') !== -1) {
      mode = 'fixed'; 
      const sections = duration.split('~');
      start_time = sections[0] ? moment(sections[0]) : '';
      end_time = sections[1] ? moment(sections[1]) : '';
    } else if (suffix_list.indexOf(duration.substr(duration.length - 1)) !== -1) {
      if (_.startsWith(duration, '-')) {
        mode = 'outside_variable';
        outside_variable = duration;
      } else {
        mode = 'inside_variable';
        inside_variable = duration;
      }
    }
    this.setState({ mode, start_time, end_time, inside_variable, outside_variable });
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
    const { start_time, end_time, mode, inside_variable, outside_variable } = this.state;

    if (mode === 'fixed') {
      if (start_time || end_time) {
        return (start_time ? moment(start_time).format('YYYY/MM/DD') : '') + '~' + (end_time ? moment(end_time).format('YYYY/MM/DD') : '');
      } else {
        return '';
      }
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
     { value: 'fixed', label: 'Fixed date' },
     { value: 'inside_variable', label: 'Start date' },
     { value: 'outside_variable', label: 'End date' }
    ];

    const variable_durations = [
      { value: '1w', label: '1w' },
      { value: '2w', label: '2w' },
      { value: '3w', label: '3w' },
      { value: '1m', label: '1m' },
      { value: '2m', label: '2m' },
      { value: '3m', label: '3m' },
      { value: '4m', label: '4m' },
      { value: '5m', label: '5m' },
      { value: '6m', label: '6m' },
      { value: '7m', label: '7m' },
      { value: '8m', label: '8m' },
      { value: '9m', label: '9m' },
      { value: '10m', label: '10m' },
      { value: '11m', label: '11m' },
      { value: '1y', label: '1y' },
      { value: '2y', label: '2y' }
    ];

    return (
      <div style={ { display: 'inline' } }>
        { this.state.isModeChanged &&
        <div style={ { width: '26%', display: 'inline-block', float: 'left', paddingRight: '5px' } }>
          <Select
            options={ modeOptions }
            disabled={ false }
            simpleValue
            searchable={ false }
            clearable={ false }
            value={ this.state.mode }
            onChange={ (newValue) => { this.setState({ mode: newValue }) } }
            placeholder='set value'/>
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
            placeholder='set value'/>
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
            placeholder='set value'/>
        </div> }
        { this.state.mode === 'inside_variable' && <span style={ { float: 'left', marginTop: '8px', marginLeft: '2px' } }>之内</span> }
        { this.state.mode === 'fixed' &&
        <div style={ { width: this.state.isModeChanged ? '34%' : '47%', display: 'inline-block', float: 'left' } }>
          <DateTime
            mode='date'
            locale='zh-cn'
            dateFormat={ 'YYYY/MM/DD' }
            timeFormat={ false }
            closeOnSelect={ true }
            inputProps={ { placeholder: 'set value' } }
            value={ this.state.start_time }
            onChange={ (newValue) => { this.onChange({ start_time: newValue }); } }/>
        </div> }
        { this.state.mode === 'fixed' && <div style={ { float: 'left', width: '6%', marginTop: '8px', textAlign: 'center' } }>～</div> }
        { this.state.mode === 'fixed' &&  
        <div style={ { width: this.state.isModeChanged ? '34%' : '47%', display: 'inline-block', float: 'right' } }>
          <DateTime
            mode='date'
            locale='zh-cn'
            dateFormat={ 'YYYY/MM/DD' }
            timeFormat={ false }
            closeOnSelect={ true }
            input={ true }
            inputProps={ { placeholder: 'set value' } }
            value={ this.state.end_time }
            onChange={ (newValue) => { this.onChange({ end_time: newValue }); } }/>
        </div> }
      </div>
    )
  }
}
