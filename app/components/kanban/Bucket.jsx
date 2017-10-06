import React, { PropTypes, Component } from 'react';
import _ from 'lodash';

const $ = require('$');

export default class Bucket extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    height: PropTypes.array.isRequired, 
    acceptAction: PropTypes.object.isRequired 
  }

  componentDidMount() {
    const winHeight = $(window).height();
    //$('.board-zone-cell').css('height', _.min([ winHeight - 170 - 46 - 10, $('.board-columns').height() ]));
  }

  render() {
    const { acceptAction, height } = this.props;

    return (
      <div className='board-zone-cell' style={ { height } }>
        { acceptAction.state.name }
      </div>);
  }
}
