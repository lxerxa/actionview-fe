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
    this.arrangeCard(props);
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
    draggedIssue: PropTypes.object.isRequired,
    issueView: PropTypes.func.isRequired,
    closeDetail: PropTypes.func.isRequired,
    rankable: PropTypes.bool.isRequired,
    setRank: PropTypes.func.isRequired
  }

  arrangeCard(props) {
    const { colNo, isSubtaskCol, subtaskShow, rankMap } = props;
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
      const parent = _.head(mainCards).parent && _.head(mainCards).parent.id || '';
      curRankCol = _.find(rankMap, { col_no: colNo, parent }) || {}; 
      _.forEach(curRankCol.rank || [], (v) => {
        const ind = _.findIndex(mainCards, { no: v });
        if (ind !== -1) {
          sortedCards.push(mainCards[ind]);
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

  issueRank(id) {
    const { colNo, setRank } = this.props;
    const { mainCards } = this.state;

    const draggedIssue = _.find(mainCards, { id });
    setRank({ 
      col_no: colNo, 
      parent: draggedIssue.parent && draggedIssue.parent.id || '', 
      rank: _.map(mainCards, (v) => v.no) });
  }

  issueView(id) {
    const { issueView, colNo } = this.props;
    issueView(id, colNo);
  }

  componentWillReceiveProps(nextProps) {
    //if (this.state.cards.length !== nextProps.cards.length) {
    if (_.isEmpty(this.props.draggedIssue) && _.isEmpty(nextProps.draggedIssue)) {
      this.state.cards = nextProps.cards;
      this.arrangeCard(nextProps);
    }
  }

  render() {
    const { 
      colNo,
      isSubtaskCol=false,
      subtaskShow=false,
      setRank,
      closeDetail, 
      rankMap,
      draggedIssue,
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
          draggedIssue={ draggedIssue }
          issueView={ this.issueView.bind(this) }
          setRank={ setRank } 
          issueRank={ this.issueRank.bind(this) } 
          moveCard={ this.moveCard.bind(this) }/>
        ) }
      </div> );
  }
}
