import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import { CardTypes } from '../../share/Constants';

const cardSource = {
  beginDrag(props) {
    this.preIndex = props.index;
    return {
      id: props.id,
      index: props.index
    };
  },
  endDrag(props, monitor, component) {
    if (this.preIndex != props.index) {
      props.setRank();
    }
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

@DropTarget(CardTypes.KANBAN_FILTER, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource(
  props => {
    if (!props.isAllowedEdit) {
      return '';
    } else {
      return CardTypes.KANBAN_FILTER;
    }
  },
  cardSource, 
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging() })
)
export default class FilterItemCard extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
    condsTxt: PropTypes.string.isRequired,
    isAllowedEdit: PropTypes.bool.isRequired,
    editFilter: PropTypes.func,
    delFilter: PropTypes.func,
    setRank: PropTypes.func.isRequired,
    moveCard: PropTypes.func.isRequired
  };

  render() {
    const { id, name, condsTxt, isAllowedEdit, isDragging, connectDragSource, connectDropTarget, editFilter, delFilter } = this.props;
    const opacity = isDragging ? 0 : 1;
    const styles = { float: 'right', cursor: 'pointer', marginLeft: '5px' };

    return connectDragSource(connectDropTarget(
      <div style={ { opacity } } className='filter-dragcard dragcard'>
        <span style={ { fontWeight: 600 } }>{ name }</span> -- <span>{ condsTxt }</span>
        { isAllowedEdit && !!delFilter && <span style={ styles } onClick={ () => { delFilter(id) } } title='Delete' className='rm-icon'><i className='fa fa-remove'></i></span> }
        { isAllowedEdit && !!editFilter && <span style={ styles } onClick={ () => { editFilter(id) } } title='Edit' className='edit-icon'><i className='fa fa-pencil'></i></span> }

      </div>
    ));
  }
}
