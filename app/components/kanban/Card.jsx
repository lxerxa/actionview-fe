import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import _ from 'lodash';

import Column from './Column';
import RightClickMenu from './RightClickMenu';

const $ = require('$');
const no_avatar = require('../../assets/images/no_avatar.png');

const cardSource = {
  beginDrag(props) {
    props.closeDetail();
    props.getDraggableActions(props.issue.id);
    this.preIndex = props.index;
    return {
      id: props.issue.id,
      entry_id: props.issue.entry_id || '',
      index: props.index,
      src_col_no: props.colNo
    };
  },

  endDrag(props, monitor, component) {
    if (this.preIndex != props.index) {
      props.issueRank(props.issue.id);
    }
    props.cleanDraggableActions();
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
    //if (!props.options.permissions || props.options.permissions.indexOf('manage_project') === -1) {
    //  return [];
    //}
    if (props.issue.parent && props.issue.parent.id) {
      return [ props.issue.parent.id + '-' + props.colNo ];
    } else {
      return [ props.colNo + '' ];
    }
  }, 
  cardTarget, 
  connect => ({
    connectDropTarget: connect.dropTarget()
  })
)
@DragSource(
  props => {
    if (props.issue.parent && props.issue.parent.id) {
      return props.issue.parent.id + '-' + props.colNo;
    } else {
      return props.colNo + '';
    }
  },
  cardSource, 
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
)
export default class Card extends Component {

  constructor(props) {
    super(props);
    this.state = { menuShow: false, menuPullRight: false, menuDropup: false };
    this.handleBlur = this.handleBlur.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
  }

  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    getDraggableActions: PropTypes.func.isRequired,
    cleanDraggableActions: PropTypes.func.isRequired,
    issueRank: PropTypes.func.isRequired,
    setRank: PropTypes.func.isRequired,
    rankLoading: PropTypes.bool.isRequired,
    closeDetail: PropTypes.func.isRequired,
    draggedIssue: PropTypes.object.isRequired,
    issueView: PropTypes.func.isRequired,
    issue: PropTypes.object.isRequired,
    openedIssue: PropTypes.object.isRequired,
    isDragging: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    pkey: PropTypes.string.isRequired,
    epicShow: PropTypes.bool,
    inSprint: PropTypes.bool,
    subtasks: PropTypes.array,
    colNo: PropTypes.number.isRequired,
    options: PropTypes.object.isRequired,
    toTop: PropTypes.func,
    toBottom: PropTypes.func,
    removeFromSprint: PropTypes.func,
    moveCard: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { issue, issueView } = this.props;

    $(findDOMNode(this)).on('contextmenu', (e) => { 
      this.handleContextMenu(e) 
    });
    $(findDOMNode(this)).on('mouseleave', (e) => { 
      if (e.toElement == null) {
        return;
      }
      this.handleBlur(e);
    });
    $(findDOMNode(this)).on('mouseup', (e) => { 
      if (e.button == 2) {
        return;
      }
      if (this.state.menuShow) {
        this.handleClick(e);
      } else {
        issueView(issue.id);
      }
    });
  }

  componentWillUnmount() {
    $(findDOMNode(this)).off('contextmenu');
    $(findDOMNode(this)).off('mouseleave');
    $(findDOMNode(this)).off('mouseup');
  }

  handleBlur(e) {
    setTimeout(() => { 
      this.setState({ menuShow: false });
    }, 200);
  }

  handleClick(e) {
    setTimeout(() => { 
      this.setState({ menuShow: false });
    }, 200);
  }

  handleContextMenu(e) {
    e.preventDefault();
    e.stopPropagation();

    const { openedIssue } = this.props;

    this.setState({ 
      menuShow: true, 
      menuPullRight: document.body.scrollWidth - `${e.pageX}` < (openedIssue && openedIssue.id ? 750 : 150) ? true: false, 
      menuDropup: document.body.scrollHeight - `${e.pageY}` < 160 ? true : false });

    const menuDom = findDOMNode(this.refs.menu);
    if (menuDom) {
      menuDom.style.left = `${e.pageX}px`;
      menuDom.style.top = `${e.pageY}px`;
    }
  }

  render() {
    const { 
      index,
      issue, 
      pkey, 
      draggedIssue, 
      issueView, 
      openedIssue, 
      isDragging, 
      connectDragSource, 
      connectDropTarget, 
      getDraggableActions,
      cleanDraggableActions,
      issueRank,
      setRank,
      rankLoading,
      closeDetail,
      subtasks=[],
      epicShow,
      inSprint,
      colNo,
      toTop,
      toBottom,
      removeFromSprint,
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
              epicShow={ epicShow }
              inSprint={ inSprint }
              colNo={ colNo }
              options={ options }
              closeDetail={ closeDetail }
              draggedIssue={ draggedIssue }
              issueView={ issueView }
              getDraggableActions={ getDraggableActions }
              cleanDraggableActions={ cleanDraggableActions }
              issueRank={ issueRank }
              setRank={ setRank }
              rankLoading={ rankLoading }
              toTop={ toTop }
              toBottom={ toBottom }
              removeFromSprint={ removeFromSprint }
              moveCard={ moveCard }/> }
          <Column 
            isSubtaskCol={ true }
            epicShow={ epicShow }
            inSprint={ inSprint }
            colNo={ colNo } 
            openedIssue={ openedIssue } 
            draggedIssue={ draggedIssue }
            issueView={ issueView } 
            getDraggableActions={ getDraggableActions } 
            cleanDraggableActions={ cleanDraggableActions } 
            cards={ subtasks } 
            setRank={ setRank }
            rankLoading={ rankLoading }
            pkey={ pkey }
            closeDetail={ closeDetail }
            removeFromSprint={ removeFromSprint }
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

    let selectedEpic = {};
    if (issue.epic) {
      selectedEpic = _.find(options.epics, { id: issue.epic });
    }

    let selectedVersion = {};
    if (issue.resolve_version) {
      selectedVersion = _.find(options.versions, { id: issue.resolve_version }) || {};
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
            <a href='#' style={ issue.state == 'Closed' ? { textDecoration: 'line-through' } : {} } onClick={ (e) => { e.preventDefault(); } }>
              { pkey } - { issue.no }
            </a>
          </div>
          <div style={ { hiteSpace: 'pre-wrap', wordWrap: 'break-word' } }>
            { issue.title || '' }
          </div>
          { epicShow && !_.isEmpty(selectedEpic) && 
          <div className='epic-title' style={ { borderColor: selectedEpic.bgColor, backgroundColor: selectedEpic.bgColor, maxWidth: '100%', marginRight: '5px' } } title={ selectedEpic.name || '-' }>
            { selectedEpic.name || '-' }
          </div> }
          { epicShow && !_.isEmpty(selectedVersion) && 
          <div className='epic-title' style={ { borderColor: '#707070', color: '#707070', backgroundColor: '#fff', maxWidth: '100%' } } title={ selectedVersion.name || '-' }>
            { selectedVersion.name || '-' }
          </div> }
        </div>
        { this.state.menuShow &&
          <RightClickMenu 
            ref='menu'
            pullRight={ this.state.menuPullRight }
            dropup={ this.state.menuDropup }
            issueId={ issue.id }
            issueNo={ issue.no }
            hasRemove={ inSprint && options.permissions && options.permissions.indexOf('manage_project') !== -1 }
            issueView={ issueView }
            toTop={ toTop }
            toBottom={ toBottom }
            removeFromSprint={ removeFromSprint }/> }
      </div>
    ));
  }
}
