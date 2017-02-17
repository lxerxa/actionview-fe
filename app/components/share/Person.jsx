import React, { Component, PropTypes } from 'react';
import { Label } from 'react-bootstrap';

const colorValues = [ '#815b3a', '#f79232', '#d39c3f', '#3b7fc4', '#4a6785', '#8eb021', '#ac707a', '#654982', '#f15c75' ];

export default class Person extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    data: PropTypes.object.isRequired
  }

  render() {
    const { data } = this.props;
    const sections = (data.email || '').split('@');
    const index = sections[0].length % 9;
    return (<Label style={ { backgroundColor: colorValues[index] } }>{ data.name }</Label>);
  }
}

