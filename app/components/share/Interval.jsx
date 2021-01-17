import React, { Component, PropTypes } from 'react';
import { Form, FormControl } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';

const moment = require('moment');

export default class Interval extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      min: '', 
      max: '' 
    };
    this.getValue = this.getValue.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  static propTypes = {
    keyPress: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.string
  }

  componentWillReceiveProps(nextProps) {
    const interval = nextProps.value || '';
    const sections = interval.split('~');
    const min = sections[0] || '';
    const max = sections[1] || '';
    this.setState({ min, max });
  }

  async onChange(data) {
    const { onChange } = this.props;
    await this.setState(data);
    onChange && onChange(this.getValue());
  }

  getValue() {
    const { min, max } = this.state;

    if (min || max) {
      return (min || '') + '~' + (max || '');
    } else {
      return '';
    }
  }

  render() {
    const { keyPress, onBlur } = this.props;

    return (
      <div style={ { display: 'inline' } }>
        <div style={ { width: '47%', display: 'inline-block', float: 'left' } }>
          <FormControl
            type='text'
            value={ this.state.min }
            onBlur={ () => { onBlur && onBlur() } }
            onKeyDown={ (e) => { keyPress(e); } }
            onChange={ (e) => { this.onChange({ min: e.target.value }) } }
            placeholder={ '输入开始值' }/>
        </div>
        <div style={ { float: 'left', width: '6%', marginTop: '8px', textAlign: 'center' } }>～</div>
        <div style={ { width: '47%', display: 'inline-block', float: 'right' } }>
          <FormControl
            type='text'
            value={ this.state.max }
            onBlur={ () => { onBlur && onBlur() } }
            onKeyDown={ (e) => { keyPress(e); } }
            onChange={ (e) => { this.onChange({ max: e.target.value }) } }
            placeholder={ '输入结束值' }/>
        </div>
      </div>
    )
  }
}
