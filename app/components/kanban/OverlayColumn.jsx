import React, { PropTypes, Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'react/lib/update';
import _ from 'lodash';
import Bucket from './Bucket';

const $ = require('$');

@DragDropContext(HTML5Backend)
export default class OverlayColumn extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    index: PropTypes.number.isRequired,
    isEmpty: PropTypes.bool.isRequired,
    draggableActions: PropTypes.array.isRequired,
    states: PropTypes.array.isRequired
  }

  render() {
    const { isEmpty, states, draggableActions } = this.props;

    const buckets = [];
    _.map(draggableActions, (v) => {
      if (_.findIndex(states, { id: v.state && v.state.id || '' }) !== -1) {
        buckets.push(v);
      }
    });

    const winHeight = $(window).height();
    const cellHeight = _.min([ winHeight - 170 - 10 - _.max([46 - $('.board-container').scrollTop(), 0]), $('.board-columns').height() ]) / _.max([ buckets.length, 1]); 

    return (
      <div className='board-zone-overlay-column' style={ { pointerEvents: isEmpty ? 'none' : 'auto' } }>
        <div className='board-zone-table'>
          <div className='board-zone-row'>
            { !isEmpty && 
              _.map(buckets, (v, i) =>
                <Bucket 
                  key={ i }
                  acceptAction={ v }
                  height={ cellHeight }/> ) }
          </div>
        </div>
      </div> );
  }
}
