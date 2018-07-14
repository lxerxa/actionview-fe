import React, { PropTypes, Component } from 'react';
import update from 'react/lib/update';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

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
    epicShow: PropTypes.bool,
    inSprint: PropTypes.bool,
    inHisSprint: PropTypes.bool,
    colNo: PropTypes.number.isRequired,
    openedIssue: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    pkey: PropTypes.string.isRequired,
    cards: PropTypes.array.isRequired,
    draggedIssue: PropTypes.object.isRequired,
    issueView: PropTypes.func.isRequired,
    getDraggableActions: PropTypes.func.isRequired,
    cleanDraggableActions: PropTypes.func.isRequired,
    closeDetail: PropTypes.func.isRequired,
    removeFromSprint: PropTypes.func.isRequired,
    setRank: PropTypes.func.isRequired,
    rankLoading: PropTypes.bool.isRequired
  }

  arrangeCard(props) {
    const { isSubtaskCol, subtaskShow } = props;
    const { cards } = this.state;
    let mainCards = [], classifiedSubtasks = {};

    if (isSubtaskCol) {
      mainCards = cards;
    } else {
      if (subtaskShow) {
        _.map(cards, (v, i) => {
          if (v.parent && v.parent.no) {
            if (_.findIndex(cards, { no: v.parent.no }) === -1) {
              mainCards.push(_.extend(v.parent, { mock: true }));
            }
            if (!classifiedSubtasks[v.parent.no]) {
              classifiedSubtasks[v.parent.no] = [];
            }
            classifiedSubtasks[v.parent.no].push(v);
          } else {
            mainCards.push(v);
          }
        });
      } else {
        mainCards = _.reject(cards, (v) => { return v.parent && v.parent.no && true });
      }
    }

    this.state.mainCards = mainCards;
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

  async issueRank(id) {
    const { setRank } = this.props;
    const { mainCards } = this.state;

    const draggedIndex = _.findIndex(mainCards, { id });
    const up = draggedIndex > 0 ? mainCards[draggedIndex - 1].no : -1;
    const down = draggedIndex < mainCards.length -1 ? mainCards[draggedIndex + 1].no : -1;
    const draggedIssue = mainCards[draggedIndex];

    const ecode = await setRank({ current: draggedIssue.no, up, down });
    if (ecode !== 0) {
      notify.show('移动失败。', 'error', 2000);
    }
  }

  issueView(id) {
    const { issueView, colNo } = this.props;
    issueView(id, colNo);
  }

  async toTop(no) {
    const { setRank } = this.props;
    const { mainCards } = this.state;

    const up = -1;
    const down = mainCards[0].no;
    if (down !== no) {
      const ecode = await setRank({ current: no, up, down });
      if (ecode !== 0) {
        notify.show('移动失败。', 'error', 2000);
      }
    }
  }

  async toBottom(no) {
    const { setRank } = this.props;
    const { mainCards } = this.state;

    const up = _.last(mainCards).no;
    const down = -1;
    if (up !== no) {
      const ecode = await setRank({ current: no, up, down });
      if (ecode !== 0) {
        notify.show('移动失败。', 'error', 2000);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.rankLoading && _.isEmpty(nextProps.draggedIssue)) {
      this.state.cards = nextProps.cards;
      this.arrangeCard(nextProps);
    }
  }

  render() {
    const { 
      colNo,
      isSubtaskCol=false,
      subtaskShow=false,
      epicShow=false,
      inSprint=false,
      inHisSprint=false,
      getDraggableActions, 
      cleanDraggableActions, 
      setRank,
      rankLoading,
      removeFromSprint,
      closeDetail, 
      draggedIssue,
      openedIssue, 
      options, 
      pkey } = this.props;
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
          openedIssue={ openedIssue }
          index={ i }
          issue={ v }
          pkey={ pkey }
          subtasks={ classifiedSubtasks[v.no] || [] }
          epicShow={ epicShow }
          inSprint={ inSprint }
          inHisSprint={ inHisSprint }
          options={ options }
          closeDetail={ closeDetail }
          draggedIssue={ draggedIssue }
          issueView={ this.issueView.bind(this) }
          getDraggableActions={ getDraggableActions }
          cleanDraggableActions={ cleanDraggableActions }
          setRank={ setRank } 
          rankLoading={ rankLoading }
          issueRank={ this.issueRank.bind(this) } 
          toTop={ this.toTop.bind(this) }
          toBottom={ this.toBottom.bind(this) }
          removeFromSprint={ removeFromSprint }
          moveCard={ this.moveCard.bind(this) }/>
        ) }
      </div> );
  }
}
