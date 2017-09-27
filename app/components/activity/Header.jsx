import React, { PropTypes, Component } from 'react';
import _ from 'lodash';

const img = require('../../assets/images/loading.gif');

export default class Header extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { getOptions } = this.props;
    getOptions();
  }

  static propTypes = {
    getOptions: PropTypes.func
  }

  render() {
    return (
      <div/>
    );
  }
}
