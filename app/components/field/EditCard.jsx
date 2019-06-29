import React, { Component, PropTypes } from 'react';
import { Form, FormGroup, FormControl, Button } from 'react-bootstrap';
import { findDOMNode } from 'react-dom';
import ItemTypes from '../../redux/constants/ItemTypes';
import { DragSource, DropTarget } from 'react-dnd';

const $ = require('$');

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
    props.move(dragIndex, hoverIndex);

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
  constructor(props) {
    super(props);
    this.state = { editing: false, touched: false, hasErr: false, text: '' };
    this.save = this.save.bind(this);
  }

  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any.isRequired,
    text: PropTypes.string.isRequired,
    del: PropTypes.func.isRequired,
    isEdited: PropTypes.bool,
    addEditingCards: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
    undo: PropTypes.func,
    move: PropTypes.func.isRequired
  };

  save() {
    const { edit, index } = this.props;
    const res = edit(index, this.state.text);
    if (res) {
      this.setState({ editing: false, hasErr: false });
    } else {
      this.setState({ hasErr: true });
    }
  } 

  async edit(index, text) {
    this.props.addEditingCards(index);
    await this.setState({ text: text, touched: true, hasErr: false, editing: true });
    $('#input-optionvalue-' + index).select(); 
  }

  render() {
    const { text, isDragging, connectDragSource, connectDropTarget, index, isEdited=false, edit, undo, del } = this.props;
    const opacity = isDragging ? 0 : 1;
    const styles = { float: 'right', cursor: 'pointer', marginLeft: '5px' };

    return connectDragSource(connectDropTarget(
      <div style={ { opacity } } className='dragcard'>
        { this.state.editing ? 
        <div style={ { width: '100%' } }>
          <FormGroup style={ { marginBottom: '0px' } } validationState={ this.state.touched && this.state.hasErr ? 'error' : null }> 
            <FormControl
              id={ 'input-optionvalue-' + index }
              style={ { height: '21px', fontSize: '10px' } }
              type='text'
              value={ this.state.text }
              onChange={ (e) => { this.setState({ text: e.target.value, touched: false }) } }
              onBlur={ () => { this.setState({ touched: true }); this.save(); } }
              placeholder='输入可选值'/>
          </FormGroup>
        </div>
        :
        <span>{ text }{ isEdited ? <span style={ { color: 'red' } }> - 已编辑</span> : '' }</span> }
        { !!del && !this.state.editing && 
        <span style={ styles } onClick={ del } title='删除' className='rm-icon'>
          <i className='fa fa-remove'></i>
        </span> }
        { isEdited && !this.state.editing &&
        <span style={ styles } onClick={ () => { undo(index) } } title='重置' className='rm-icon'>
          <i className='fa fa-undo'></i>
        </span> }
        { !!edit && !this.state.editing && 
        <span style={ styles } onClick={ this.edit.bind(this, index, text) } title='编辑' className='rm-icon'>
          <i className='fa fa-pencil'></i>
        </span> }
      </div>
    ));
  }
}
