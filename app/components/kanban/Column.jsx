import React, { PropTypes, Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'react/lib/update';
import Card from './Card';
import _ from 'lodash';

const no_avatar = require('../../assets/images/no_avatar.png');

@DragDropContext(HTML5Backend)
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
    cards: PropTypes.array.isRequired
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

  render() {
    const { options, pkey } = this.props;
    const { cards } = this.state;

    return (
      <li className='board-column'>
      { _.map(cards, (v, i) => {
        return (
          <Card key={ v.id }
            index={ i }
            id={ v.id }
            title={ v.title }
            abb={ _.findIndex(options.types, { id: v.type }) !== -1 ? _.find(options.types, { id: v.type }).abb : '-' }
            pkey={ pkey }
            no={ v.no }
            color={ _.findIndex(options.priorities, { id: v.priority }) !== -1 ? _.find(options.priorities, { id: v.priority }).color : '' }
            avatar={ v.avatar || no_avatar }
            moveCard={ this.moveCard.bind(this) }/> ) } ) }
      </li> );
  }
}
