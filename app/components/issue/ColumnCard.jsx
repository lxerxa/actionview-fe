import React, { Component, PropTypes } from 'react';
import { FormGroup, FormControl } from 'react-bootstrap';
import { findDOMNode } from 'react-dom';
import ItemTypes from '../../redux/constants/ItemTypes';
import { DragSource, DropTarget } from 'react-dnd';

const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index
    };
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

@DropTarget(ItemTypes.CARD, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
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
    text: PropTypes.string.isRequired,
    width: PropTypes.string.isRequired,
    editWidth: PropTypes.func.isRequired,
    deleteCard: PropTypes.func.isRequired,
    moveCard: PropTypes.func.isRequired
  };

  render() {
    const { index, text, width, editWidth, isDragging, connectDragSource, connectDropTarget, deleteCard } = this.props;
    const opacity = isDragging ? 0 : 1;

    return connectDragSource(connectDropTarget(
      <div style={ { opacity } } className='dragcard'>
        <span>{ text }</span>
        { !!deleteCard && <span className='comments-button' style={ { float: 'right' } } onClick={ deleteCard } title='删除'><i className='fa fa-remove'></i></span> }
        <span style={ { width: '100px', marginRight: '25px', float: 'right' } }>
          <FormGroup style={ { marginBottom: '0px' } }>
            <FormControl
              style={ { height: '21px', fontSize: '10px' } }
              type='text'
              value={ width }
              onChange={ (e) => { const v = e.target.value.replace(/[^0-9]/ig, ''); editWidth(index, v) } }
              placeholder='宽度(px)'/>
          </FormGroup>
        </span>
      </div>
    ));
  }
}
