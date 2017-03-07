import React, { PropTypes, Component } from 'react';
import { Button, FormControl } from 'react-bootstrap';
import _ from 'lodash';

const img = require('../../assets/images/loading.gif');

export default class Header extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    indexLoading: PropTypes.bool.isRequired,
    collection: PropTypes.array.isRequired
  }

  render() {
    const {  indexLoading, collection } = this.props;

    return (
      <div>
        <div className='list-unstyled clearfix'>
          <h3><span style={ { marginLeft: '15px' } }>#活动#</span></h3>
        </div>
      </div>
    );
  }
}
