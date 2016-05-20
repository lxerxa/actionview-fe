import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import _ from 'lodash';
import TypeCard from './TypeCard';

const style = {
  width: '100%'
};

@DragDropContext(HTML5Backend)
class TypeSortModal extends Component {
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.state = { cards: [] };
  }

  moveCard(dragIndex, hoverIndex) {
    const { cards } = this.state;
    const dragCard = cards[dragIndex];

    this.setState(update(this.state, {
      cards: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard]
        ]
      }
    }));
  }

  static propTypes = {
    cards: PropTypes.array,
    hide: PropTypes.func.isRequired
  }

  save() {
    const { hide } = this.props;
    hide();
  }

  cancel() {
    const { hide } = this.props;
    hide();
  }

  render() {
    const cardNum = this.state.cards.length;
    const cardNum2 = this.props.cards.length;
    for (let i = 0; i < cardNum2; i++) {
      this.state.cards.push({
        id: this.props.cards[i].id,
        text: this.props.cards[i].name
      });
    }
    for (let i = 0; i < cardNum; i++) {
      this.state.cards.pop();
    }

    const { cards } = this.state;

    return (
      <Modal { ...this.props } onHide={ this.cancel.bind(this) } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-la'>编辑问题类型顺序</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={ style }>
            { cards.map((card, i) => {
              return (
                <TypeCard key={ card.id }
                  index={ i }
                  id={ card.id }
                  text={ card.text }
                  moveCard={ this.moveCard } />
              );
            }) }
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className='ralign' onClick={ this.save.bind(this) }>确定</Button>
          <Button onClick={ this.cancel.bind(this) }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default TypeSortModal;
