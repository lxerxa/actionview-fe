import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import _ from 'lodash';
import Card from '../share/Card';

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
    const cardNum = this.props.cards.length;
    for (let i = 0; i < cardNum; i++) {
      this.state.cards.push({
        id: this.props.cards[i].id,
        text: this.props.cards[i].name
      });
    }
    this.state.strCards = JSON.stringify(this.state.cards);
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
    close: PropTypes.func.isRequired
  }

  async save() {
    const { close, setSort } = this.props;
    let ecode = 0;
    const values = { sequence: _.map(this.state.cards, _.iteratee('id')) }; 
    ecode = await setSort(values);

    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
    } else {
      this.setState({ ecode: ecode });
    }
  }

  cancel() {
    const { close, sortLoading } = this.props;
    if (sortLoading) {
      return;
    }
    close();
  }

  render() {
    const { cards, strCards } = this.state;
    const { sortLoading } = this.props;
    return (
      <Modal { ...this.props } onHide={ this.cancel.bind(this) } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>编辑优先级顺序</Modal.Title>
        </Modal.Header>
        <Modal.Body style={ { maxHeight: '450px', overflow: 'auto' } }>
          <p>通过上下拖拽改变显示顺序。</p>
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
          <img src={ img } className={ sortLoading ? 'loading' : 'hide' }/>
          <Button className='ralign' disabled={ sortLoading || strCards == JSON.stringify(cards) } onClick={ this.save.bind(this) }>确定</Button>
          <Button disabled={ sortLoading } onClick={ this.cancel.bind(this) }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
