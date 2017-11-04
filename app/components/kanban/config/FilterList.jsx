import React, { PropTypes, Component } from 'react';
import update from 'react/lib/update';
import _ from 'lodash';

import FilterItemCard from './FilterItemCard';

export default class FilterList extends Component {
  constructor(props) {
    super(props);
    this.state = { cards: [], ecode: 0 };
    this.state.cards = props.filters;
    this.kid = props.kid;
    this.setRank = this.setRank.bind(this);
  }

  static propTypes = {
    isAllowedEdit: PropTypes.bool.isRequired,
    kid: PropTypes.string.isRequired,
    editFilter: PropTypes.func.isRequired,
    delFilter: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    condsTxt: PropTypes.func.isRequired,
    filters: PropTypes.array.isRequired
  }

  componentWillReceiveProps(nextProps) {
    if (this.kid !== nextProps.kid || !_.isEqual(_.sortByOrder(this.state.cards || [], ['no']), _.sortByOrder(nextProps.filters || [], ['no']))) {
      this.state.cards = nextProps.filters;
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
    update({ id: this.kid, filters: this.state.cards });
  }

  render() {
    const { isAllowedEdit, condsTxt, editFilter, delFilter } = this.props;
    const { cards } = this.state;

    return (
      <div style={ { marginBottom: '10px' } }>
      { _.map(cards, (v, i) =>
        <FilterItemCard
          isAllowedEdit={ isAllowedEdit }
          key={ v.no }
          index={ i }
          id={ v.no }
          name={ v.name }
          condsTxt={ condsTxt(v.query || {}) }
          editFilter={ editFilter }
          delFilter={ delFilter }
          setRank={ this.setRank }
          moveCard={ this.moveCard.bind(this) }/>
        ) }
      </div> );
  }
}
