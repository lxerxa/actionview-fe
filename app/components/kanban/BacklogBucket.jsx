import React, { PropTypes, Component } from 'react';
import { DropTarget } from 'react-dnd';
import _ from 'lodash';

const MoveIssueNotify = require('./MoveIssueNotify');
const $ = require('$');

const bucketTarget = {
  drop(props, monitor) {
    const { sprintNo, moveSprintIssue, columns } = props;
    const card = monitor.getItem();

    const src_sprint = columns[card.src_col_no];
    const dest_sprint = _.find(columns, { no: sprintNo });
    if (_.isEmpty(src_sprint) || _.isEmpty(dest_sprint)) {
      return;
    }

    const values = { issue_id: card.id, dest_sprint, src_sprint };
    moveSprintIssue(values);
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
    this.state = { moveNotify: false };
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
      columns,
      sprintNo, 
      height 
    } = this.props;

    const isActive = isOver && canDrop

    let backgroundColor = '#ebf2f9';
    if (isActive) {
      backgroundColor = 'darkseagreen';
    }

    let sprintName = '';
    if (sprintNo == 0) {
      sprintName = 'Backlog';
    } else {
      const sprint = _.find(columns, { no: sprintNo });
      if (!_.isEmpty(sprint) && sprint.name) {
        sprintName = sprint.name;
      } else {
        sprintName = 'Sprint ' + sprintNo; 
      }
    }

    return connectDropTarget (
      <div className='board-zone-cell' style={ { height, backgroundColor } }>
        { sprintName }
      </div>);
  }
}
