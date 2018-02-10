import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import ItemTypes from '../../../redux/constants/ItemTypes';
import { DragSource, DropTarget } from 'react-dnd';
import _ from 'lodash';

const cardSource = {
  beginDrag(props) {
    this.preIndex = props.index;
    return {
      id: props.column.no,
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
    const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientX = clientOffset.x - hoverBoundingRect.left;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
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

@DropTarget(ItemTypes.KANBAN_COLUMN, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource(
  props => {
    if (!props.isAllowedEdit) {
      return '';
    } else {
      return ItemTypes.KANBAN_COLUMN;
    }
  },
  cardSource, 
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging() })
)
export default class ColumnItemCard extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isDragging: PropTypes.bool.isRequired,
    column: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    editColumn: PropTypes.func,
    delColumn: PropTypes.func,
    setRank: PropTypes.func.isRequired,
    isAllowedEdit: PropTypes.bool.isRequired,
    moveCard: PropTypes.func.isRequired
  };

  render() {
    const { column, options, isAllowedEdit, isDragging, connectDragSource, connectDropTarget, editColumn, delColumn } = this.props;
    const opacity = isDragging ? 0 : 1;
    const styles = { float: 'right', cursor: 'pointer' };

    return connectDragSource(connectDropTarget(
      <div style={ { opacity } } className='config-column'>
        <div style={ { fontWeight: 600, paddingBottom: '10px', borderBottom: '1px solid #ccc' } }>
          { column.name }
          { column.max &&
          <span className='config-wip'>{ 'Max-' + column.max }</span> }
          { column.min &&
          <span className='config-wip'>{ 'Min-' + column.min }</span> }
          { isAllowedEdit && !!delColumn && <span style={ styles } onClick={ () => { delColumn(column.no) } } title='删除' className='rm-icon'><i className='fa fa-remove'></i></span> }
          { isAllowedEdit && !!editColumn && <span style={ styles } onClick={ () => { editColumn(column.no) } } title='编辑' className='edit-icon'><i className='fa fa-pencil'></i></span> }
        </div>
        <div>
        { _.map(column.states, (v, i) => 
          <div key={ i } className='config-column-card'>
            { _.findIndex(options.states, { id: v }) !== -1 ? _.find(options.states, { id : v }).name : '' }
          </div>) }
        </div>
      </div>
    ));
  }
}
