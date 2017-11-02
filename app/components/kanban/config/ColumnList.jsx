import React, { PropTypes, Component } from 'react';
import update from 'react/lib/update';
import _ from 'lodash';

import ColumnItemCard from './ColumnItemCard';

export default class ColumnList extends Component {
  constructor(props) {
    super(props);
    this.state = { cards: [], ecode: 0 };
    this.state.cards = props.columns;

    this.kid = props.kid;
  }

  static propTypes = {
    kid: PropTypes.string.isRequired,
    editColumn: PropTypes.func.isRequired,
    delColumn: PropTypes.func.isRequired,
    options: PropTypes.object.isRequired,
    columns: PropTypes.array.isRequired
  }

  componentWillReceiveProps(nextProps) {
    if (this.kid !== nextProps.kid) {
      this.state.cards = nextProps.columns;
    }
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
    const { editColumn, delColumn, options } = this.props;
    const { cards } = this.state;

    return (
      <div className='config-columns' style={ { height: '300px',marginBottom: '10px' } }>
      { _.map(cards, (v, i) =>
        <ColumnItemCard
          key={ v.no }
          index={ i }
          column={ v }
          options={ options }
          editColumn={ editColumn }
          delColumn={ delColumn }
          moveCard={ this.moveCard.bind(this) }/>
        ) }
      </div> );
  }
}
