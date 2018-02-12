import React, { PropTypes, Component } from 'react';
import { DropTarget } from 'react-dnd';
import _ from 'lodash';

const $ = require('$');

const bucketTarget = {
  drop(props, monitor) {
    const { dragAction } = props;
    const card = monitor.getItem();
    // fix me
  }
}

@DropTarget(
  props => {
    if (props.draggedIssue && props.draggedIssue.parent && props.draggedIssue.parent.id) {
      return _.map(props.accepts, (v) => props.draggedIssue.parent.id + '-' + v);
    } else {
      return props.accepts;
    }
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
    accepts: PropTypes.array.isRequired,
    height: PropTypes.number.isRequired, 
    doAction: PropTypes.func.isRequired,
    draggedIssue: PropTypes.object, 
    dragAction: PropTypes.object.isRequired 
  }

  render() {
    const { 
      accepts,
      isOver,
      canDrop,
      connectDropTarget,
      doAction,
      workflowScreenShow,
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
