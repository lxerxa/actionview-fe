import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import ItemTypes from '../../redux/constants/ItemTypes';
import { DragSource, DropTarget } from 'react-dnd';
import _ from 'lodash';

const cardSource = {
  beginDrag(props) {
    return {
      id: props.column.no,
      index: props.index
    };
  }
};

@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class StateCard extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isDragging: PropTypes.bool.isRequired,
    name: PropTypes.object.isRequired
  };

  render() {
    const { column, options, isDragging, connectDragSource, connectDropTarget, editColumn, delColumn } = this.props;
    const opacity = isDragging ? 0 : 1;
    const styles = { float: 'right', cursor: 'pointer' };

    return connectDragSource(connectDropTarget(
      <div style={ { opacity } } className='config-column-card'>
        <div style={ { fontWeight: 600, paddingBottom: '10px', borderBottom: '1px solid #ccc' } }>
          { column.name }
        </div>
        <div>
        { _.map(column.states, (v) => 
          <div className='config-column-card'>{ _.findIndex(options.states, { id: v }) !== -1 ? _.find(options.states, { id : v }).name : '' }</div>) }
        </div>
      </div>
    ));
  }
}
