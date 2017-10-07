import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import ItemTypes from '../../redux/constants/ItemTypes';
import { DragSource, DropTarget } from 'react-dnd';

const cardSource = {
  beginDrag(props) {
    props.getDraggableActions(props.id);
    return {
      id: props.id,
      index: props.index
    };
  },
  endDrag(props, monitor, component) {
    props.cleanDraggableActions();
    //alert(props.index)
  }
};

const cardTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.moveCard(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  }
};

@DropTarget(props => props.acceptTypes, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource(props => props.type, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class Card extends Component {

  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any.isRequired,
    title: PropTypes.string.isRequired,
    abb: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    pkey: PropTypes.string.isRequired,
    acceptTypes: PropTypes.array.isRequired,
    no: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    moveCard: PropTypes.func.isRequired
  };

  render() {
    const { title, abb, pkey, no, color, avatar, isDragging, connectDragSource, connectDropTarget } = this.props;
    const opacity = isDragging ? 0 : 1;
    const styles = { borderLeft: '5px solid ' + color };

    return connectDragSource(connectDropTarget(
      <div className='board-issue' style={ { ...styles, opacity } }>
        <div className='board-issue-content'>
          <div style={ { float: 'right' } }>
            <img className='board-avatar' src={ avatar }/>
          </div>
          <div>
            <span className='type-abb'>{ abb }</span>
            <a href='#'>{ pkey } - { no }</a>
          </div>
          <div>
            { title }
          </div>
        </div>
      </div>
    ));
  }
}
