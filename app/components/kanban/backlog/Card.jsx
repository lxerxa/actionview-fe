import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import _ from 'lodash';

import Column from './Column';

const no_avatar = require('../../../assets/images/no_avatar.png');

const cardSource = {
  beginDrag(props) {
    props.closeDetail();
    this.preIndex = props.index;
    return {
      id: props.issue.id,
      index: props.index
    };
  },

  endDrag(props, monitor, component) {
    if (this.preIndex != props.index) {
      props.issueRank(props.issue.id);
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

@DropTarget(
  props => {
    if (!props.rankable) {
      return [];
    }
    return _.map(props.accepts, (v) => { 
      if (props.issue.parent && props.issue.parent.id) {
        return props.issue.parent.id + '-' + v;
      } else {
        return v;
      }
    }) 
  }, 
  cardTarget, 
  connect => ({
    connectDropTarget: connect.dropTarget()
  })
)
@DragSource(
  props => { 
    if (props.issue.parent && props.issue.parent.id) {
      return props.issue.parent.id + '-' + props.issue.state;
    } else {
      return props.issue.state;
    }
  }, 
  cardSource, 
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
)
export default class Card extends Component {

  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    issueRank: PropTypes.func.isRequired,
    setRank: PropTypes.func.isRequired,
    closeDetail: PropTypes.func.isRequired,
    draggedIssue: PropTypes.object.isRequired,
    issueView: PropTypes.func.isRequired,
    issue: PropTypes.object.isRequired,
    rankMap: PropTypes.array.isRequired,
    openedIssue: PropTypes.object.isRequired,
    isDragging: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    pkey: PropTypes.string.isRequired,
    subtasks: PropTypes.array,
    accepts: PropTypes.array.isRequired,
    colNo: PropTypes.number.isRequired,
    options: PropTypes.object.isRequired,
    moveCard: PropTypes.func.isRequired
  };

  render() {
    const { 
      index,
      issue, 
      pkey, 
      draggedIssue, 
      issueView, 
      rankMap,
      openedIssue, 
      isDragging, 
      connectDragSource, 
      connectDropTarget, 
      issueRank,
      setRank,
      closeDetail,
      subtasks=[],
      accepts,
      colNo,
      moveCard,
      options } = this.props;

    if (subtasks.length > 0) {
      return connectDropTarget( 
        <div style={ { opacity } }>
          { issue.mock ?
            <span style={ { marginLeft: '5px' } }>
              { issue.no } - { issue.title }
            </span>
            :
            <Card
              openedIssue={ openedIssue }
              index={ index }
              issue={ issue }
              pkey={ pkey }
              colNo={ colNo }
              accepts={ accepts }
              options={ options }
              closeDetail={ closeDetail }
              draggedIssue={ draggedIssue }
              issueView={ issueView }
              rankMap={ rankMap }
              issueRank={ issueRank }
              setRank={ setRank }
              moveCard={ moveCard }/> }
          <Column 
            isSubtaskCol={ true }
            colNo={ colNo } 
            rankMap={ rankMap }
            openedIssue={ openedIssue } 
            draggedIssue={ draggedIssue }
            issueView={ issueView } 
            cards={ subtasks } 
            setRank={ setRank }
            pkey={ pkey }
            accepts={ accepts }
            closeDetail={ closeDetail }
            options={ options }/>
        </div> );
    }

    const opacity = isDragging ? 0 : 1;
    const styles = { borderLeft: '5px solid ' + (_.findIndex(options.priorities, { id: issue.priority }) !== -1 ? _.find(options.priorities, { id: issue.priority }).color : '') };

    let backgroundColor = '';
    if (issue.id == openedIssue.id) {
      backgroundColor = '#eee';
    }

    let marginLeft = '';
    if (issue.parent && issue.parent.id) {
      marginLeft = '10px';
    }

    return connectDragSource(connectDropTarget(
      <div className='board-issue' style={ { ...styles, opacity, backgroundColor, marginLeft } }>
        <div className='board-issue-content'>
          <div style={ { float: 'right' } }>
            <img className='board-avatar' src={ issue.assignee && issue.assignee.avatar ? '/api/getavatar?fid=' + issue.assignee.avatar : no_avatar }/>
          </div>
          <div>
            <span className='type-abb' title={ _.findIndex(options.types, { id: issue.type }) !== -1 ? _.find(options.types, { id: issue.type }).name : '' }>
              { _.findIndex(options.types, { id: issue.type }) !== -1 ? _.find(options.types, { id: issue.type }).abb : '-' }
            </span>
            <a href='#' onClick={ (e) => { e.preventDefault(); issueView(issue.id) } }>
              { pkey } - { issue.no }
            </a>
          </div>
          <div>
            { issue.title || '' }
          </div>
        </div>
      </div>
    ));
  }
}
