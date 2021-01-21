import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import DateTime from 'react-datetime';
import _ from 'lodash';

const moment = require('moment');

export default class Duration extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      options: !_.isEmpty(props.options) ? props.options : [ 'fixed', 'variable' ],
      mode: 'fixed',
      start_time: '', 
      end_time: '', 
      start_direct: '', // current: 当前，past：过去，future：将来
      start_value: '',
      end_direct: '', // current: 当前，past：过去，future：将来
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

    let mode = this.state.mode, start_time = '', end_time = '', start_direct = '', start_value = '', end_direct = '', end_value = '';

    const suffix_list = [ 'd', 'w', 'm', 'y' ];

    const duration = nextProps.value || '';
    if (duration) {
      const sections = duration.split('~');

      let unit = '';
      if (sections[0]) {
        unit = sections[0].charAt(sections[0].length - 1);
      } else if (sections[1]) {
        unit = sections[1].charAt(sections[1].length - 1);
      }

      if (suffix_list.indexOf(unit) !== -1) {
        mode = 'variable';
      } else {
        mode = 'fixed';
      }

      if (mode == 'fixed') {
        start_time = sections[0] || '';
        end_time = sections[1] || '';
      } else {
        if (sections[0]) {
          const firstChar = sections[0].charAt(0);
          if (firstChar == '-') {
            start_direct = 'past';
            start_value = sections[0].substr(1);
          } else if (firstChar == '0') {
            start_direct = 'current';
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
          } else if (firstChar == '0') {
            end_direct = 'current';
            end_value = sections[1].substr(1);;
          } else {
            end_direct = 'future';
            end_value = sections[1];
          }
        }
      }
    }

    this.setState({ mode, start_time, end_time, start_direct, start_value, end_direct, end_value });
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
    } else if (mode === 'variable') {
      let tmp_start_time = '', tmp_end_time = '';
      if (start_direct && start_value) {
        if (start_direct == 'current') {
          tmp_start_time = '0' + start_value;
        } else if (start_direct == 'past') {
          tmp_start_time = '-' + start_value;
        } else if (start_direct == 'future') {
          tmp_start_time = start_value;
        }
      }

      if (end_direct && end_value) {
        if (end_direct == 'current') {
          tmp_end_time = '0' + end_value;
        } else if (end_direct == 'past') {
          tmp_end_time = '-' + end_value;
        } else if (end_direct == 'future') {
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
      start_direct, 
      start_value, 
      end_direct, 
      end_value 
    } = this.state;

    const modeOptions = [
      { value: 'fixed', label: '固定时间段' }, 
      { value: 'variable', label: '动态时间段' }
    ];

    const directOptions = [
      { value: 'current', label: '当前' },
      { value: 'past', label: '过去' },
      { value: 'future', label: '未来' }
    ];

    const variableDurations = [
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
        { mode === 'variable' &&
        <div style={ { width: '85px', display: 'inline-block', float: 'left', paddingRight: '5px' } }>
          <Select
            options={ directOptions }
            disabled={ false }
            simpleValue
            searchable={ false }
            clearable={ false }
            value={ start_direct || null }
            onChange={ (newValue) => { this.setState({ start_direct: newValue, start_value: '' }) } }
            placeholder='请选择'/>
        </div> }
        { mode === 'variable' &&
        <div style={ { width: '100px', display: 'inline-block', float: 'left' } }>
          <Select
            options={ !start_direct ? [] : (start_direct == 'current' ? currentVariableDurations : variableDurations) }
            disabled={ false }
            simpleValue
            searchable={ false }
            clearable={ false }
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

        <div style={ { float: 'left', width: '30px', marginTop: '8px', textAlign: 'center' } }>～</div>

        { mode === 'variable' &&
        <div style={ { width: '85px', display: 'inline-block', float: 'left', paddingRight: '5px' } }>
          <Select
            options={ directOptions }
            disabled={ false }
            simpleValue
            searchable={ false }
            clearable={ false }
            value={ end_direct || null }
            onChange={ (newValue) => { this.setState({ end_direct: newValue, end_value: '' }); } }
            placeholder='请选择'/>
        </div> }
        { mode === 'variable' &&
        <div style={ { width: '100px', display: 'inline-block', float: 'left' } }>
          <Select
            options={ !end_direct ? [] : (end_direct == 'current' ? currentVariableDurations : variableDurations) }
            disabled={ false }
            simpleValue
            searchable={ false }
            clearable={ false }
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
