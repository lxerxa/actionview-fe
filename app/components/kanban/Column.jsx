import React, { PropTypes, Component } from 'react';
import update from 'react/lib/update';
import _ from 'lodash';

import Card from './Card';

export default class Column extends Component {
  constructor(props) {
    super(props);

    this.moveCard = this.moveCard.bind(this);
    this.state = { cards: [] };

    this.state.cards = props.cards;
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
    this.state.cards = nextProps.cards;
    //if (this.state.cards.length === nextProps.cards.length) {
    //  return;
    //}

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
    const { cards } = this.state;

    let mainCards = [];
    let classifiedSubtasks = {};
    if (isSubtaskCol) {
      mainCards = cards;
    } else {
      if (subtaskShow) {
        _.map(cards, (v, i) => {
          if (v.parent && v.parent.id) {
            const index = _.findIndex(mainCards, { id: v.parent.id });
            if (index === -1) {
              mainCards.push(_.extend(v.parent, { mock: true }));
            }
            if (!classifiedSubtasks[v.parent.id]) {
              classifiedSubtasks[v.parent.id] = [];
            }
            classifiedSubtasks[v.parent.id].push(v);
          } else {
            mainCards.push(v);
          }
        });
      } else {
        mainCards = _.filter(cards, (v) => { return !v.parent || !v.parent.id }); 
      }
    }

    let display = {};
    if (isSubtaskCol) {
      display =  'block';
    }

    return (
      <li className='board-column' style={ { display } }>
      { _.map(mainCards, (v, i) => {
        let card = {};
        if (v.mock) {
          card = ( <span style={ { marginLeft: '5px' } }>{ v.no } - { v.title }</span> );
        } else {
          card = (
            <Card
              openedIssue={ openedIssue }
              index={ i }
              issue={ v }
              pkey={ pkey }
              accepts={ accepts }
              options={ options }
              closeDetail={ closeDetail }
              issueView={ this.issueView.bind(this) }
              getDraggableActions={ getDraggableActions }
              cleanDraggableActions={ cleanDraggableActions }
              rankable={ rankable } 
              setRank={ this.setRank.bind(this) } 
              moveCard={ this.moveCard.bind(this) }/> );
        }
        if (subtaskShow && classifiedSubtasks[v.id] && classifiedSubtasks[v.id].length > 0) {
          const subCol = (
            <Column
              no={ no }
              isSubtaskCol={ true }
              openedIssue={ openedIssue }
              issueView={ this.issueView.bind(this) }
              getDraggableActions={ getDraggableActions }
              cleanDraggableActions={ cleanDraggableActions }
              rankable={ rankable }
              setRank={ this.setRank.bind(this) } 
              cards={ classifiedSubtasks[v.id] }
              pkey={ pkey }
              accepts={ accepts }
              closeDetail={ closeDetail }
              options={ options } /> );
          return ( <div key={ v.id }>{ card } { subCol }</div> );
        } else {
          return ( <div key={ v.id }>{ card }</div> );
        } } ) }
      </li> );
  }
}
