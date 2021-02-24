import React, { PropTypes, Component } from 'react';
import _ from 'lodash';

const GridItem = require('./GridItem');

export default class Grids extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    cellWidth: PropTypes.number.isRequired,
    collection: PropTypes.array.isRequired,
    dates: PropTypes.object.isRequired,
    foldIssues: PropTypes.array.isRequired,
    markedIssue: PropTypes.object.isRequired,
    today: PropTypes.string.isRequired
  }

  render() {
    const { 
      cellWidth,
      collection, 
      dates, 
      foldIssues, 
      markedIssue, 
      today=''
    } = this.props;

    const dates2 = _.flatten(_.values(dates));
    return (
      <div
        className='ganttview-grid'
        style={ { width: dates2.length * cellWidth + 'px' } }>
      { _.map(_.reject(collection, (v) => v.parent && foldIssues.indexOf(v.parent.id) != -1), (v, key) => (
        <GridItem
          key={ v.id }
          cellWidth={ cellWidth }
          dates={ dates2 }
          issue={ v }
          markedIssue={ markedIssue }
          today={ today } />
        ) ) }
      </div>);
  }
}
