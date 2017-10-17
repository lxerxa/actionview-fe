import React, { PropTypes, Component } from 'react';
import update from 'react/lib/update';
import _ from 'lodash';

import Card from './Card';

export default class Column extends Component {
  constructor(props) {
    super(props);

    this.moveCard = this.moveCard.bind(this);
    this.state = { mainCards: [], classifiedSubtasks: {} };

    if (props.isSubtaskCol) {
      this.state.mainCards = props.cards;
    } else {
      if (props.subtaskShow) {
        _.map(props.cards, (v, i) => {
          if (v.parent && v.parent.id) {
            if (_.findIndex(props.cards, { id: v.parent.id }) === -1) {
              this.state.mainCards.push(_.extend(v.parent, { mock: true }));
            }
            if (!this.state.classifiedSubtasks[v.parent.id]) {
              this.state.classifiedSubtasks[v.parent.id] = [];
            }
            this.state.classifiedSubtasks[v.parent.id].push(v);
          } else {
            this.state.mainCards.push(v);
          }
        });
      } else {
        this.state.mainCards = props.cards;
      }
    }
  }

  static propTypes = {
    isSubtaskCol: PropTypes.bool,
    subtaskShow: PropTypes.bool,
    no: PropTypes.number.isRequired,
    openedIssue: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    pkey: PropTypes.string.isRequired,
    accepts: PropTypes.array.isRequired,
    cards: PropTypes.array.isRequired,
    issueView: PropTypes.func.isRequired,
    getDraggableActions: PropTypes.func.isRequired,
    cleanDraggableActions: PropTypes.func.isRequired,
    closeDetail: PropTypes.func.isRequired,
    rankable: PropTypes.bool.isRequired,
    setRank: PropTypes.func.isRequired
  }

  moveCard(dragIndex, hoverIndex) {
    const { mainCards } = this.state;
    const dragCard = mainCards[dragIndex];

    this.setState(update(this.state, {
      mainCards: {
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
    //if (this.state.cards.length === nextProps.cards.length) {
    //  return;
    //}
    //this.state.cards = nextProps.cards;

    //const oldCardIds = _.map(this.state.cards, (v) => v.id );
    //const newCardIds = _.map(nextProps.cards, (v) => v.id );

    //const diff = _.difference(oldCardIds, newCardIds);
    //const diff2 = _.difference(newCardIds, oldCardIds);

    //if (diff.length > 0) {
    //  const removedCardId = diff.pop();
    //  this.state.cards = _.reject(this.state.cards, (v) => { return v.id === removedCardId });
    //} else {
    //  const addedCard = _.find(nextProps.cards, { id: diff2.pop() });
    //  this.state.cards.push(addedCard);
    //  this.state.cards = _.sortByOrder(this.state.cards, [ 'rank' ]);
    //}
  }

  render() {
    const { 
      no,
      isSubtaskCol=false,
      subtaskShow=false,
      getDraggableActions, 
      cleanDraggableActions, 
      rankable, 
      closeDetail, 
      openedIssue, 
      options, 
      pkey, 
      accepts } = this.props;
    const { mainCards, classifiedSubtasks } = this.state;

    return (
      <li className='board-column'>
      { _.map(mainCards, (v, i) =>
        <Card
          key={ v.id }
          colNo={ no }
          openedIssue={ openedIssue }
          index={ i }
          issue={ v }
          pkey={ pkey }
          subtasks={ classifiedSubtasks[v.id] || [] }
          accepts={ accepts }
          options={ options }
          closeDetail={ closeDetail }
          issueView={ this.issueView.bind(this) }
          getDraggableActions={ getDraggableActions }
          cleanDraggableActions={ cleanDraggableActions }
          rankable={ rankable } 
          setRank={ this.setRank.bind(this) } 
          moveCard={ this.moveCard.bind(this) }/>
        ) }
      </li> );
  }
}
