import React, { PropTypes, Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'react/lib/update';
import _ from 'lodash';

const $ = require('$');

@DragDropContext(HTML5Backend)
export default class OverlayColumn extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    index: PropTypes.number.isRequired,
    draggableActions: PropTypes.array.isRequired,
    states: PropTypes.array.isRequired
  }

  componentDidMount() {
    const winHeight = $(window).height();
    //$('.board-zone-cell').css('height', _.min([ winHeight - 170 - 46 - 10, $('.board-columns').height() ]));
  }

  render() {
    const { states, draggableActions } = this.props;

    const columnStates = _.map(states, (v) => v.id || '');
    const draggableStates = _.map(draggableActions, (v) => v.state || '');

    console.log(_.intersection(columnStates, draggableStates));

    return (
      <div className='board-zone-overlay-column'>
        <div className='board-zone-table'>
          <div className='board-zone-row'>
            <div className='board-zone-cell'>
              aa
            </div>
          </div>
        </div>
      </div> );
  }
}
