import React, { PropTypes, Component } from 'react';
import { OverlayTrigger, Popover, Grid, Row, Col, ControlLabel } from 'react-bootstrap';
import _ from 'lodash';

const BlockItem = require('./BlockItem');

export default class Blocks extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    cellWidth: PropTypes.number.isRequired,
    blockHeight: PropTypes.number.isRequired,
    collection: PropTypes.array.isRequired,
    origin: PropTypes.number.isRequired,
    foldIssues: PropTypes.array.isRequired,
    options: PropTypes.object.isRequired,
    mode: PropTypes.string.isRequired
  }

  render() {
    const { 
      cellWidth,
      blockHeight,
      collection, 
      origin, 
      foldIssues, 
      options,
      mode
    } = this.props;

    return (
      <div className='ganttview-blocks'>
        { _.map(_.reject(collection, (v) => v.parent && foldIssues.indexOf(v.parent.id) != -1), (v, key) =>
          <BlockItem
            key={ v.id }
            cellWidth={ cellWidth }
            blockHeight={ blockHeight }
            issue={ v }
            foldIssues={ foldIssues }
            origin={ origin }
            mode={ mode }
            options={ options }/>
        ) }
      </div> );
  }
}
