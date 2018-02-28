import React, { PropTypes, Component } from 'react';
import { DropTarget } from 'react-dnd';
import _ from 'lodash';

const $ = require('$');

const bucketTarget = {
  drop(props, monitor) {
    const { sprintNo, moveSprintIssue } = props;
    const card = monitor.getItem();
    moveSprintIssue(card.id, sprintNo);
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
    sprintNo: PropTypes.number.isRequired, 
    columns: PropTypes.array.isRequired, 
    height: PropTypes.number.isRequired, 
    moveSprintIssue: PropTypes.func.isRequired,
    draggedIssue: PropTypes.object
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
