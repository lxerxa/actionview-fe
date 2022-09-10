import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import _ from 'lodash';

import Column from './Column';
import RightClickMenu from './RightClickMenu';

const moment = require('moment');
const $ = require('$');
const Avatar = require('../share/Avatar');

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
    if (props.inHisSprint || !props.options.permissions || props.options.permissions.indexOf('manage_project') === -1) {
      return [];
    }
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
    this.getLabelStyle = this.getLabelStyle.bind(this);
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
    displayFields: PropTypes.array,
    epicShow: PropTypes.bool,
    inSprint: PropTypes.bool,
    inHisSprint: PropTypes.bool,
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
      e.preventDefault();
      e.stopPropagation();

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

  shouldComponentUpdate(newProps, newState) {
    const { openedIssue, issue } = this.props;
    return newProps.openedIssue.id && [ newProps.openedIssue.parent_id, newProps.openedIssue.id, openedIssue.parent_id, openedIssue.id ].indexOf(issue.id) === -1 ? false : true;
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

    this.props.closeDetail();

    this.setState({ 
      menuShow: true, 
      menuPullRight: document.body.scrollWidth - `${e.pageX}` < 150 ? true: false, 
      menuDropup: document.body.scrollHeight - `${e.pageY}` < 160 ? true : false });

    const menuDom = findDOMNode(this.refs.menu);
    if (menuDom) {
      menuDom.style.left = `${e.pageX}px`;
      menuDom.style.top = `${e.pageY}px`;
    }
  }

  getLabelStyle(name) {
    const { options: { labels=[] } } = this.props;
    const label = _.find(labels, { name });

    let style = {
      marginTop: '5px', 
      maxWidth: '100%', 
      float: 'unset'
    };

    if (label && label.bgColor) {
      style = {
        backgroundColor: label.bgColor,
        borderColor: label.bgColor,
        border: '1px solid ' + label.bgColor,
        color: '#fff',
        ...style
      };
    }
    return style;
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
      displayFields=[],
      epicShow,
      inSprint,
      inHisSprint,
      colNo,
      toTop,
      toBottom,
      removeFromSprint,
      moveCard,
      options 
    } = this.props;

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
              displayFields={ displayFields }
              epicShow={ epicShow }
              inSprint={ inSprint }
              inHisSprint={ inHisSprint }
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
            displayFields={ displayFields }
            epicShow={ epicShow }
            inSprint={ inSprint }
            inHisSprint={ inHisSprint }
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
      backgroundColor = '#e6f7ff';
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
            <Avatar data={ issue.assignee || {} } />
          </div>
          <div>
            <span className='type-abb' title={ _.findIndex(options.types, { id: issue.type }) !== -1 ? _.find(options.types, { id: issue.type }).name : '' }>
              { _.findIndex(options.types, { id: issue.type }) !== -1 ? _.find(options.types, { id: issue.type }).abb : '-' }
            </span>
            <a href='#' style={ issue.state == 'Closed' ? { textDecoration: 'line-through' } : {} } onClick={ (e) => { e.preventDefault(); } }>
              { pkey } - { issue.no }
            </a>
          </div>
          <div style={ { whiteSpace: 'pre-wrap', wordWrap: 'break-word' } }>
            { issue.title || '' }
          </div>
          { displayFields.length > 0 && 
          <div style={ { marginTop: '5px' } }>
            { _.map(displayFields, (v) => {
              if (_.isEmpty(issue[v]) && !_.isNumber(issue[v])) {
                return;
              }
              if (v == 'labels') {
                return (
                  <div style={ { whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontSize: '12px' } }>
                    <span style={ { marginRight: '3px', marginTop: '7px', float: 'left' } }><b>标签</b>:</span>
                    { _.map(issue[v], (lv) => <span title={ lv } className='issue-label' style={ this.getLabelStyle(lv) }>{ lv }</span>) }
                  </div>);
              } else {
                const field = _.find(options.fields || [] , { key: v });
                if (!field) { 
                  return;
                }

                let contents = '';
                if (field.type === 'SingleUser') {
                  contents = issue[v].name;
                } else if (field.type === 'MultiUser') {
                  contents = _.map(issue[v], (v) => v.name).join(',');
                } else if ([ 'Select', 'RadioGroup', 'SingleVersion' ].indexOf(field.type) !== -1) {
                  contents = _.findIndex(field.optionValues || [], { id: issue[v] }) === -1 ? '-' : _.find(field.optionValues, { id: issue[v] }).name;
                } else if ([ 'MultiSelect', 'CheckboxGroup', 'MultiVersion' ].indexOf(field.type) !== -1) {
                  const ids = !_.isArray(issue[v]) ? issue[v].split(',') : issue[v];
                  const names = [];
                  _.forEach(ids, (id) => {
                    const tmp = _.findIndex(field.optionValues || [], { id }) !== -1 ? _.find(field.optionValues, { id }).name : '';
                    if (tmp) {
                      names.push(tmp);
                    }
                  });
                  contents = names.length > 0 ? _.uniq(names).join(',') : '-';
                } else if (field.type === 'DatePicker') {
                  contents = moment.unix(issue[v]).format('YYYY/MM/DD');
                } else if (field.type === 'DateTimePicker') {
                  contents = moment.unix(issue[v]).format('YYYY/MM/DD HH:mm');
                } else {
                  contents = issue[v] + (field.key == 'progress' ? '%' : '');
                }
                return (
                  <div style={ { whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontSize: '12px' } }>
                    <span style={ { marginRight: '3px' } }><b>{ field.name }</b>:</span><span>{ contents }</span> 
                  </div>);
              }
            }) }
          </div> }
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
            hasMove={ !inHisSprint && options.permissions && options.permissions.indexOf('manage_project') !== -1 }
            issueView={ issueView }
            toTop={ toTop }
            toBottom={ toBottom }
            removeFromSprint={ removeFromSprint }/> }
      </div>
    ));
  }
}
