import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import _ from 'lodash';
import Card from './Card';

const img = require('../../assets/images/loading.gif');
const style = {
  width: '100%'
};

@DragDropContext(HTML5Backend)
export default class SortCardsModal extends Component {
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.state = { cards: [], ecode: 0 };
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
    sortLoading: PropTypes.bool,
    setSort: PropTypes.func,
    hide: PropTypes.func.isRequired
  }

  async save() {
    const { hide, setSort } = this.props;
    let ecode = 0;
    const values = { mode: 'sort', cards: this.state.cards };
    ecode = await setSort(values);

    if (ecode === 0) {
      hide();
      this.setState({ ecode: 0 });
    } else {
      this.setState({ ecode: ecode });
    }

    hide();
  }

  cancel() {
    const { hide, sortLoading } = this.props;
    if (sortLoading) {
      return;
    }
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
    this.state.cards.splice(cardNum2, cardNum);

    const { cards } = this.state;
    const { sortLoading } = this.props;
    return (
      <Modal { ...this.props } onHide={ this.cancel.bind(this) } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-la'>编辑问题类型顺序</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={ style }>
            { cards.map((card, i) => {
              return (
                <Card key={ card.id }
                  index={ i }
                  id={ card.id }
                  text={ card.text }
                  moveCard={ this.moveCard } />
              );
            }) }
          </div>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && 'aaaa' }</span>
          <image src={ img } className={ sortLoading ? 'loading' : 'hide' }/>
          <Button className='ralign' disabled={ sortLoading } onClick={ this.save.bind(this) }>确定</Button>
          <Button disabled={ sortLoading } onClick={ this.cancel.bind(this) }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
