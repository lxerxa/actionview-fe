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
    this.setRank = this.setRank.bind(this);
  }

  static propTypes = {
    isAllowedEdit: PropTypes.bool.isRequired,
    kid: PropTypes.string.isRequired,
    editColumn: PropTypes.func.isRequired,
    delColumn: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
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

  setRank() {
    const { update } = this.props;
    update({ id: this.kid, columns: this.state.cards });
  }

  render() {
    const { editColumn, delColumn, options, isAllowedEdit } = this.props;
    const { cards } = this.state;

    return (
      <div className='config-columns' style={ { minHeight: '300px',marginBottom: '10px' } }>
      { _.map(cards, (v, i) =>
        <ColumnItemCard
          isAllowedEdit={ isAllowedEdit }
          key={ v.no }
          index={ i }
          column={ v }
          options={ options }
          editColumn={ editColumn }
          delColumn={ delColumn }
          setRank={ this.setRank }
          moveCard={ this.moveCard.bind(this) }/>
        ) }
      </div> );
  }
}
