import React, { PropTypes, Component } from 'react';
import update from 'react/lib/update';
import _ from 'lodash';
import Card from './Card';

const no_avatar = require('../../assets/images/no_avatar.png');

export default class Column extends Component {
  constructor(props) {
    super(props);

    this.moveCard = this.moveCard.bind(this);
    this.state = { cards: [] };

    this.state.cards = props.cards;
  }

  static propTypes = {
    options: PropTypes.object.isRequired,
    pkey: PropTypes.string.isRequired,
    accepts: PropTypes.array.isRequired,
    cards: PropTypes.array.isRequired,
    issueView: PropTypes.func.isRequired,
    getDraggableActions: PropTypes.func.isRequired,
    cleanDraggableActions: PropTypes.func.isRequired,
    setRank: PropTypes.func.isRequired
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

  setRank(id, index) {
    const { setRank } = this.props;
    const { cards } = this.state;
    setRank(id, { up: index <= 0 ? '' : cards[index - 1].id, down: index >= cards.length - 1 ? '' : cards[index + 1].id });
  }

  render() {
    const { issueView, getDraggableActions, cleanDraggableActions, options, pkey, accepts } = this.props;
    const { cards } = this.state;

    return (
      <li className='board-column'>
      { _.map(cards, (v, i) => {
        return (
          <Card key={ v.id }
            index={ i }
            id={ v.id }
            entry_id={ v.entry_id || '' }
            title={ v.title }
            abb={ _.findIndex(options.types, { id: v.type }) !== -1 ? _.find(options.types, { id: v.type }).abb : '-' }
            pkey={ pkey }
            no={ v.no }
            color={ _.findIndex(options.priorities, { id: v.priority }) !== -1 ? _.find(options.priorities, { id: v.priority }).color : '' }
            avatar={ v.avatar || no_avatar }
            type={ v.state }
            accepts={ accepts }
            issueView={ issueView }
            getDraggableActions={ getDraggableActions }
            cleanDraggableActions={ cleanDraggableActions }
            setRank={ this.setRank.bind(this) } 
            moveCard={ this.moveCard.bind(this) }/> ) } ) }
      </li> );
  }
}
