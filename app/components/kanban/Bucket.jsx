import React, { PropTypes, Component } from 'react';
import { DropTarget } from 'react-dnd';
import _ from 'lodash';

const $ = require('$');

const bucketTarget = {
  drop(props, monitor) {
    const { dragAction, doAction, workflowScreenShow } = props;
    const card = monitor.getItem();
    if (dragAction.screen) {
      workflowScreenShow(card.id, dragAction.id);
    } else {
      doAction(card.id, card.entry_id, { action_id: dragAction.id });
    }
  }
}

@DropTarget(
  props => {
    return _.map(props.columns, (v, i) => {
      if (props.draggedIssue && props.draggedIssue.parent && props.draggedIssue.parent.id) {
        return props.draggedIssue.parent.id + '-' + i;
      } else {
        return i + '';
      }
    })
  },
  bucketTarget, 
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  })
)
export default class Bucket extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    columns: PropTypes.array.isRequired,
    height: PropTypes.number.isRequired, 
    doAction: PropTypes.func.isRequired,
    workflowScreenShow: PropTypes.func.isRequired,
    draggedIssue: PropTypes.object, 
    dragAction: PropTypes.object.isRequired 
  }

  render() {
    const { 
      isOver,
      canDrop,
      connectDropTarget,
      dragAction, 
      height } = this.props;

    const isActive = isOver && canDrop

    let backgroundColor = '#ebf2f9';
    if (isActive) {
      backgroundColor = 'darkseagreen';
    }

    return connectDropTarget (
      <div className='board-zone-cell' style={ { height, backgroundColor } }>
        { dragAction.state.name }
      </div>);
  }
}
