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
    no: PropTypes.number.isRequired,
    openedIssue: PropTypes.object.isRequired,
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

  issueView(id) {
    const { issueView, no } = this.props;
    issueView(id, no);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.cards.length === nextProps.cards.length) {
      return;
    }

    const oldCardIds = _.map(this.state.cards, (v) => v.id );
    const newCardIds = _.map(nextProps.cards, (v) => v.id );

    const diff = _.difference(oldCardIds, newCardIds);
    const diff2 = _.difference(newCardIds, oldCardIds);

    if (diff.length > 0) {
      const removedCardId = diff.pop();
      this.state.cards = _.reject(this.state.cards, (v) => { return v.id === removedCardId });
    } else {
      const addedCard = _.find(nextProps.cards, { id: diff2.pop() });
      this.state.cards.push(addedCard);
      this.state.cards = _.sortByOrder(this.state.cards, [ 'rank' ]);
    }
  }

  render() {
    const { getDraggableActions, cleanDraggableActions, openedIssue, options, pkey, accepts } = this.props;
    const { cards } = this.state;

    return (
      <li className='board-column'>
      { _.map(cards, (v, i) => {
        return (
          <Card key={ v.id }
            index={ i }
            openedIssue={ openedIssue }
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
            issueView={ this.issueView.bind(this) }
            getDraggableActions={ getDraggableActions }
            cleanDraggableActions={ cleanDraggableActions }
            setRank={ this.setRank.bind(this) } 
            moveCard={ this.moveCard.bind(this) }/> ) } ) }
      </li> );
  }
}
