import React, { PropTypes, Component } from 'react';
import _ from 'lodash';

export default class Grids extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    cellWidth: PropTypes.number.isRequired,
    collection: PropTypes.array.isRequired,
    dates: PropTypes.array.isRequired,
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
        <div
          className='ganttview-grid-row'
          style={ { width: dates2.length * cellWidth + 'px' } }
          key={ v.id }>
        { _.map(dates2, (v2, key2) =>
          <div
            className={ 'ganttview-grid-row-cell ' + (v2.date == today ? 'ganttview-today' : (v2.notWorking === 1 ? 'ganttview-weekend' : '')) }
            style={ { backgroundColor: markedIssue.id == v.id ? '#FFFACD' : '', width: cellWidth + 'px' } }
            key={ v2.date }/> ) }
        </div> ) ) }
      </div>);
  }
}
