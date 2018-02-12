import React, { PropTypes, Component } from 'react';
import update from 'react/lib/update';
import _ from 'lodash';

import Bucket from './Bucket';

const $ = require('$');

export default class OverlayColumn extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    index: PropTypes.number.isRequired,
    isEmpty: PropTypes.bool.isRequired,
    draggedIssue: PropTypes.object,
    options: PropTypes.object.isRequired,
    acceptStates: PropTypes.array.isRequired
  }

  render() {
    const { isEmpty, acceptStates, draggedIssue, options } = this.props;

    // get action num of reaching the state
    const actionNum = _.countBy(draggableActions, _.iteratee('state'));

    const buckets = [];
    _.map(draggableActions, (v) => {
      if (_.indexOf(acceptStates, v.state) !== -1) {
        const state = _.clone(_.find(options.states, { id: v.state }));
        if (actionNum[v.state] > 1) {
          state.name = state.name + ' - ' + v.name;
        }
        buckets.push({ ...v, state });
      }
    });

    let headerHeight = 120 + 50;
    if ($('#main-header').css('display') == 'none') {
      headerHeight = 28 + 50; 
    }
    const winHeight = $(window).height();
    const cellHeight = _.min([ winHeight - headerHeight - 10 - _.max([46 - $('.board-container').scrollTop(), 0]), $('.board-columns').height() ]) / _.max([ buckets.length, 1]); 

    return (
      <div className='board-zone-overlay-column' style={ { pointerEvents: isEmpty ? 'none' : 'auto' } }>
        <div className='board-zone-table'>
          <div className='board-zone-row'>
            { !isEmpty && 
              _.map(buckets, (v, i) =>
                <Bucket 
                  key={ i }
                  draggedIssue={ draggedIssue }
                  accepts={ _.map(options.states, (v) => v.id) }
                  dragAction={ v }
                  height={ cellHeight }/> ) }
          </div>
        </div>
      </div> );
  }
}
