import React, { PropTypes, Component } from 'react';
import { Button, FormControl } from 'react-bootstrap';
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
    getOptions: PropTypes.func,
    indexLoading: PropTypes.bool.isRequired,
    collection: PropTypes.array.isRequired
  }

  render() {
    const {  indexLoading, collection } = this.props;

    return (
      <div/>
    );
  }
}
