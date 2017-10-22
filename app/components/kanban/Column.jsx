import React, { PropTypes, Component } from 'react';
import update from 'react/lib/update';
import _ from 'lodash';

import Card from './Card';

export default class Column extends Component {
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.arrangeCard = this.arrangeCard.bind(this);

    this.state = { cards: [], mainCards: [], classifiedSubtasks: {} };
    this.state.cards = props.cards;
    this.arrangeCard();
  }

  static propTypes = {
    isSubtaskCol: PropTypes.bool,
    subtaskShow: PropTypes.bool,
    colNo: PropTypes.number.isRequired,
    rankMap: PropTypes.array.isRequired,
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

  arrangeCard() {
    const { colNo, isSubtaskCol, subtaskShow, rankMap } = this.props;
    const { cards } = this.state;
    let mainCards = [], classifiedSubtasks = {};

    if (isSubtaskCol) {
      mainCards = cards;
    } else {
      if (subtaskShow) {
        _.map(cards, (v, i) => {
          if (v.parent && v.parent.id) {
            if (_.findIndex(cards, { id: v.parent.id }) === -1) {
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
        mainCards = _.reject(cards, (v) => { return v.parent && v.parent.id && true });
      }
    }

    let curRankCol = {};
    const sortedCards = []; 
    if (mainCards.length > 0) {
      const parent = _.head(mainCards).parent && _.head(mainCards).parent.no || '';
      curRankCol = _.find(rankMap, { col_no: colNo, parent }) || {}; 
      _.forEach(curRankCol.rank || [], (v) => {
        const ind = _.findIndex(cards, { no: v });
        if (ind !== -1) {
          sortedCards.push(cards[ind]);
        }
      });
    }

    this.state.mainCards = _.union(sortedCards, _.filter(mainCards, (v) => { return _.findIndex(sortedCards, { no: v.no }) === -1 }));
    this.state.classifiedSubtasks = classifiedSubtasks;
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

  setRank(id) {
    const { colNo, setRank } = this.props;
    const { mainCards } = this.state;

    const draggedIssue = _.find(mainCards, { id });
    setRank({ col_no: colNo, parent: draggedIssue.parent && draggedIssue.parent.id || '', rank: _.map(mainCards, (v) => v.no) });
  }

  issueView(id) {
    const { issueView, colNo } = this.props;
    issueView(id, colNo);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.cards.length === nextProps.cards.length) {
      return;
    }

    this.state.cards = nextProps.cards;
    this.arrangeCard();

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
      colNo,
      isSubtaskCol=false,
      subtaskShow=false,
      getDraggableActions, 
      cleanDraggableActions, 
      rankable, 
      closeDetail, 
      rankMap,
      openedIssue, 
      options, 
      pkey, 
      accepts } = this.props;
    const { mainCards, classifiedSubtasks } = this.state;

    let styles = {};
    if (isSubtaskCol) {
      styles = { display: 'block' };
    }

    return (
      <div className='board-column' style={ styles }>
      { _.map(mainCards, (v, i) =>
        <Card
          key={ v.id }
          colNo={ colNo }
          rankMap={ rankMap }
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
      </div> );
  }
}
